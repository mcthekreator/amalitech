import { ICALC_CONNECTION } from '@igus/icalc-common';
import {
  ChainflexDataAccessService,
  ConfigurationDataAccessService,
  ConfigurationSnapshotDataAccessService,
  Mat017ItemDataAccessService,
} from '@igus/icalc-configurations-infrastructure';
import type { Calculation, Configuration, ConfigurationSnapshot, SingleCableCalculation } from '@igus/icalc-domain';
import {
  CalculationStatus,
  ICALC_DYNAMIC_CALC_NUMBER_PREFIX,
  ICALC_DYNAMIC_MAT_NUMBER_PREFIX,
  icalcTestConfigurationWithRemovedChainflex,
} from '@igus/icalc-domain';
import { CalculationEntity } from '@igus/icalc-entities';
import { SingleCableCalculationDataAccessService } from '../single-cable-calculation';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CalculationConfigurationStatusDataAccessService } from './calculation-configuration-status-data-access.service';
import { CalculationDataAccessService } from './calculation-data-access.service';

@Injectable()
export class DbSeedService {
  constructor(
    @InjectRepository(CalculationEntity, ICALC_CONNECTION)
    private readonly calculationRepository: Repository<Calculation>,
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource,
    private readonly singleCableCalculationDataAccessService: SingleCableCalculationDataAccessService,
    private readonly calculationConfigurationStatusDataAccessService: CalculationConfigurationStatusDataAccessService,
    private readonly configurationSnapshotDataAccessService: ConfigurationSnapshotDataAccessService,
    private readonly configurationDataAccessService: ConfigurationDataAccessService,
    private readonly calculationDataAccessService: CalculationDataAccessService,
    private readonly chainflexDataAccessService: ChainflexDataAccessService,
    private readonly mat017ItemDataAccessService: Mat017ItemDataAccessService
  ) {}

  /**
   * deleteCalculationAndConfigurationsTransactional
   *
   * deletes a given calculation and all related objects (status, sccs, configurations, snapshots)
   * this can lead to additional calculations being deleted (for example if they have the same configuration assignments)
   *
   * @param initialCalculation to be deleted with all its related objects
   */
  public async deleteCalculationAndConfigurationsTransactional(initialCalculation: Calculation): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    const allSCCs = await this.getAllSCCs(initialCalculation.status, initialCalculation.singleCableCalculations);
    const allCalculations = await this.getAllCalculationsBySingleCableCalculation(initialCalculation, allSCCs);

    const allSnapshots: ConfigurationSnapshot[] = [];
    const allConfigurations: Configuration[] = [];

    try {
      await queryRunner.startTransaction();

      // now we gather all related objects of the calculations we compiled before
      // while gathering those we already remove all related status & sccs entries
      for (const calculation of allCalculations) {
        if (calculation.status === CalculationStatus.inProgress) {
          // UNLOCKED CALCULATIONS
          const configurations = await this.getConfigurationsByCalculationId(calculation.id);

          for (const configuration of configurations) {
            const statusList = await this.calculationConfigurationStatusDataAccessService.findManyByConfigurationId(
              configuration.id
            );

            for (const status of statusList) {
              await queryRunner.manager.remove(status);
            }
            const sccList = await this.getSingleCableCalculations(calculation.id, configuration.id, null);

            if (sccList) {
              sccList.forEach(async (scc) => {
                await queryRunner.manager.remove(scc);
              });
            }
            allConfigurations.push(configuration);
          }
        } else if (calculation.status === CalculationStatus.locked) {
          // LOCKED CALCULATIONS
          const snapshots = await this.getSnapshotsByCalculationId(calculation.id);

          for (const snapshot of snapshots) {
            const statusList = await this.calculationConfigurationStatusDataAccessService.findManyByConfigurationId(
              snapshot?.configurationData?.id
            );

            for (const status of statusList) {
              await queryRunner.manager.remove(status);
            }
            const sccList = await this.getSingleCableCalculations(calculation.id, null, snapshot.id);

            if (sccList) {
              sccList.forEach(async (scc) => {
                await queryRunner.manager.remove(scc);
              });
            }
            allSnapshots.push(snapshot);
            const originalConfig = await this.configurationDataAccessService.findOneById(snapshot.isSnapshotOf);

            allConfigurations.push(originalConfig);
          }
        }
      }
      const removedChainflexCable = await this.chainflexDataAccessService.findOneByPartNumber(
        icalcTestConfigurationWithRemovedChainflex.partNumber
      );

      if (removedChainflexCable) {
        await queryRunner.manager.remove(removedChainflexCable);
      }

      await this.mat017ItemDataAccessService.deleteManyWithPrefix(ICALC_DYNAMIC_MAT_NUMBER_PREFIX);
      // in conclusion we remove all the gathered objects related to our initital
      // calculation (see above) and the calculations themselves
      for (const snapshot of allSnapshots) {
        await queryRunner.manager.remove(snapshot);
      }
      for (const configuration of allConfigurations) {
        await queryRunner.manager.remove(configuration);
      }
      for (const calculation of allCalculations) {
        await queryRunner.manager.remove(calculation);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new NotAcceptableException('Could not delete calculation & configuration(s).');
    } finally {
      await queryRunner.release();
    }
  }

  public async deleteAllDynamicallyCreatedCalculationsAndConfigurations(): Promise<void> {
    try {
      const dynamicallyCreatedCalculations: Calculation[] =
        await this.calculationDataAccessService.queryManyCalculationsByCalculationNumberPrefix(
          ICALC_DYNAMIC_CALC_NUMBER_PREFIX
        );

      for (const calculation of dynamicallyCreatedCalculations) {
        await this.deleteCalculationAndConfigurationsTransactional(calculation);
      }
    } catch (e) {
      console.error('Error on dynamic calculations deletion. Transaction failed. Rollback initialized.', e);
    }
  }

  private async getAllSCCs(
    status: CalculationStatus,
    initialSCCs: SingleCableCalculation[]
  ): Promise<SingleCableCalculation[]> {
    let sccs: SingleCableCalculation[] = [];

    // starting with the SCCs of the initial calculation to be deleted we want to find out here
    // which other SCCs exist for the configurations/snapshots related to the initial calculation
    if (status === CalculationStatus.inProgress) {
      const initialConfigurations = (await this.getConfigsOrSnapshots(initialSCCs)).configurations;

      const initialConfigIds: string[] = initialConfigurations.map((config) => config.id);

      sccs = await this.singleCableCalculationDataAccessService.findByConfigurationIds(initialConfigIds);
      // it is possible that snapshots exist for the above configuration ids
      const possibleSnapshots =
        await this.configurationSnapshotDataAccessService.findManyByIsSnapshotOf(initialConfigIds);
      const snapshotIds: string[] = possibleSnapshots.map((snapshot) => snapshot.id);
      const additionalSCCs = await this.singleCableCalculationDataAccessService.findBySnapshotIds(snapshotIds);

      additionalSCCs.forEach((scc) => {
        if (!sccs.includes(scc)) {
          sccs.push(scc);
        }
      });
    } else if (status === CalculationStatus.locked) {
      const initialSnapshots = (await this.getConfigsOrSnapshots(initialSCCs, true)).snapshots;

      const initialSnapshotIds: string[] = initialSnapshots.map((snapshot) => snapshot.id);
      const initialOriginalConfigIds: string[] = initialSnapshots.map((snapshot) => snapshot.isSnapshotOf);

      sccs = await this.singleCableCalculationDataAccessService.findBySnapshotIds(initialSnapshotIds);
      const additionalSCCs =
        await this.singleCableCalculationDataAccessService.findByConfigurationIds(initialOriginalConfigIds);

      additionalSCCs.forEach((scc) => {
        if (!sccs.includes(scc)) {
          sccs.push(scc);
        }
      });
    }
    return sccs;
  }

  private async getAllCalculationsBySingleCableCalculation(
    initialCalculation,
    sccs: SingleCableCalculation[]
  ): Promise<Calculation[]> {
    const calculations: Calculation[] = [initialCalculation];

    // now that we have all related SCCs we can find out which other calculations are related
    // to the configurations/snapshots of our inital calculation
    for (const scc of sccs) {
      const calculation = await this.calculationRepository.findOneBy({ id: scc.calculationId });

      if (!calculations.find((existingCalc) => existingCalc.id === calculation.id)) {
        calculations.push(calculation);
      }
    }
    return calculations;
  }

  private async getConfigurationsByCalculationId(calculationId: string): Promise<Configuration[]> {
    const sccs = await this.singleCableCalculationDataAccessService.findByCalculationId(calculationId);
    const configIds: string[] = sccs
      .map((scc) => scc.configurationId)
      .filter((configId, index, array) => index === array.indexOf(configId));

    return this.configurationDataAccessService.findManyByIds(configIds);
  }

  private async getSnapshotsByCalculationId(calculationId: string): Promise<ConfigurationSnapshot[]> {
    const sccs = await this.singleCableCalculationDataAccessService.findByCalculationId(calculationId);
    const snapshotIds: string[] = sccs
      .map((scc) => scc.snapshotId)
      .filter((snapshotId, index, array) => index === array.indexOf(snapshotId));

    return this.configurationSnapshotDataAccessService.findManyByIds(snapshotIds);
  }

  private async getConfigsOrSnapshots(
    sccs: SingleCableCalculation[],
    locked?: boolean
  ): Promise<{
    configurations?: Configuration[];
    snapshots?: ConfigurationSnapshot[];
  }> {
    if (!locked) {
      const configIds: string[] = sccs.map((scc) => scc.configurationId);

      return {
        configurations: await this.configurationDataAccessService.findManyByIds(configIds),
      };
    }

    const snapshotIds: string[] = sccs.map((scc) => scc.snapshotId);

    return {
      snapshots: await this.configurationSnapshotDataAccessService.findManyByIds(snapshotIds),
    };
  }

  private async getSingleCableCalculations(
    calcId: string,
    configId?: string,
    snapshotId?: string
  ): Promise<SingleCableCalculation[]> {
    let sccList: SingleCableCalculation[];

    if (configId) {
      sccList = await this.singleCableCalculationDataAccessService.findManyByCalculationIdAndConfigurationId(
        calcId,
        configId
      );
    } else if (snapshotId) {
      sccList = await this.singleCableCalculationDataAccessService.findManyByCalculationIdAndSnapshotId(
        calcId,
        snapshotId
      );
    }
    return sccList;
  }
}
