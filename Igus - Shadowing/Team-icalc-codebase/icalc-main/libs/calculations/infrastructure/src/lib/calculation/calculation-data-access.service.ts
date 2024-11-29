import type {
  Calculation,
  CalculationConfigurationStatus,
  Configuration,
  IcalcUser,
  SingleCableCalculation,
} from '@igus/icalc-domain';
import {
  CalculationStatus,
  ConfigurationMapper,
  DateUtils,
  UserMapper,
  WorkStepPricesValueObject,
  getConfigurationDataFromSingleCableCalculations,
} from '@igus/icalc-domain';
import type { ConfigurationSnapshotEntity } from '@igus/icalc-entities';
import { CalculationEntity, SingleCableCalculationEntity } from '@igus/icalc-entities';
import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import type { DeepPartial, FindOptionsWhere, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { DataSource, Repository } from 'typeorm';
import { SingleCableCalculationDataAccessService } from '../single-cable-calculation';
import { CalculationConfigurationStatusDataAccessService } from './calculation-configuration-status-data-access.service';
import {
  ConfigurationSnapshotDataAccessService,
  Mat017ItemDataAccessService,
} from '@igus/icalc-configurations-infrastructure';

@Injectable()
export class CalculationDataAccessService {
  constructor(
    @InjectRepository(CalculationEntity, ICALC_CONNECTION)
    private readonly calculationRepository: Repository<Calculation>,
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource,
    private readonly singleCableCalculationDataAccessService: SingleCableCalculationDataAccessService,
    private readonly calculationConfigurationStatusDataAccessService: CalculationConfigurationStatusDataAccessService,
    private readonly configurationSnapshotDataAccessService: ConfigurationSnapshotDataAccessService,
    private readonly mat017ItemDataAccessService: Mat017ItemDataAccessService
  ) {}

  public async save(calculation: DeepPartial<Calculation>): Promise<Calculation> {
    return this.calculationRepository.save(calculation);
  }

  public createFromRepo(newCalculation: Partial<Calculation>): Calculation {
    return this.calculationRepository.create({
      ...newCalculation,
      creationDate: new Date(),
      modificationDate: new Date(),
    });
  }

  public async createAndAssignNewConfigurationTransactional(
    configuration: Configuration,
    calculation: Calculation,
    user: IcalcUser,
    batchSize: number
  ): Promise<SingleCableCalculation> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      const calculationId = calculation.id;

      const resultConfiguration = await queryRunner.manager.save<Configuration>(configuration);

      const userName = UserMapper.toUserName(user);
      const calculationConfigurationStatusEntity = this.calculationConfigurationStatusDataAccessService.createFromRepo(
        calculationId,
        resultConfiguration.id,
        userName
      );

      await queryRunner.manager.save<CalculationConfigurationStatus>(calculationConfigurationStatusEntity);

      const sccEntity = this.singleCableCalculationDataAccessService.createFromRepo(
        resultConfiguration,
        calculation,
        user.id,
        batchSize
      );

      const result = await queryRunner.manager.save<SingleCableCalculation>(sccEntity);

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Could not create and assign Configuration');
    } finally {
      await queryRunner.release();
    }
  }

  public async linkExistingConfigurationTransactional(
    configuration: Configuration,
    calculation: Calculation,
    user: IcalcUser,
    batchSize: number,
    chainflexLength?: number
  ): Promise<SingleCableCalculation> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      const calculationId = calculation.id;
      const configurationId = configuration.id;

      const userName = UserMapper.toUserName(user);

      const calcAndConfStatus = await this.calculationConfigurationStatusDataAccessService.queryByCalcIdAndConfId(
        calculationId,
        configurationId
      );

      if (!calcAndConfStatus) {
        const calculationConfigurationStatusEntity =
          this.calculationConfigurationStatusDataAccessService.createFromRepo(calculationId, configurationId, userName);

        await queryRunner.manager.save<CalculationConfigurationStatus>(calculationConfigurationStatusEntity);
      }

      const sccEntity = this.singleCableCalculationDataAccessService.createFromRepo(
        configuration,
        calculation,
        user.id,
        batchSize,
        chainflexLength
      );

      const result = await queryRunner.manager.save<SingleCableCalculation>(sccEntity);

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Could not create and assign Configuration');
    } finally {
      await queryRunner.release();
    }
  }

  public async removeLinkBetweenConfigurationAndCalculationTransactional(
    calculation: Calculation,
    singleCableCalculation: SingleCableCalculation,
    configuration: Configuration
  ): Promise<Calculation> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      const calculationId = calculation.id;
      const configurationId = configuration.id;

      await queryRunner.manager.remove(singleCableCalculation);

      const remainingSingleCableCalculation =
        await this.singleCableCalculationDataAccessService.findOneByCalculationIdAndConfigurationId(
          calculationId,
          configurationId
        );

      if (!remainingSingleCableCalculation) {
        const calcAndConfStatus = await this.calculationConfigurationStatusDataAccessService.queryByCalcIdAndConfId(
          calculationId,
          configurationId
        );

        if (calcAndConfStatus) {
          queryRunner.manager.remove(calcAndConfStatus);
        }
      }

      const updatedCalculation = await this.queryCalculationById(calculationId, queryRunner);

      await queryRunner.commitTransaction();
      return updatedCalculation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Could not remove link between Configuration and Calculation');
    } finally {
      await queryRunner.release();
    }
  }

  public async createNewCalculationAndConfigurationTransactional(
    calculation: Calculation,
    configuration: Configuration,
    singleCableCalculation: Partial<SingleCableCalculation>,
    user: IcalcUser
  ): Promise<{
    calculation: Calculation;
    configuration: Configuration;
    singleCableCalculation: SingleCableCalculation;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const resultCalculation = await queryRunner.manager.save<Calculation>(calculation);
      const resultConfiguration = await queryRunner.manager.save<Configuration>(configuration);

      const statusEntity = this.calculationConfigurationStatusDataAccessService.createFromRepo(
        resultCalculation.id,
        resultConfiguration.id,
        resultCalculation.createdBy
      );

      await queryRunner.manager.save(statusEntity);

      const { batchSize, chainflexLength, commercialWorkStepOverrides } = singleCableCalculation;

      const sccEntity = await this.singleCableCalculationDataAccessService.createFromRepo(
        resultConfiguration,
        resultCalculation,
        user.id,
        batchSize,
        chainflexLength,
        commercialWorkStepOverrides
      );

      const resultScc = await queryRunner.manager.save<SingleCableCalculation>(sccEntity);

      resultScc.assignedBy = UserMapper.toPublicUser(user);

      await queryRunner.commitTransaction();

      return { calculation: resultCalculation, configuration: resultConfiguration, singleCableCalculation: resultScc };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new NotAcceptableException('Could not create calculation & configuration.', err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createCalculationWithSingleCableCalculationsTransactional(
    existingCalculation: Calculation,
    newCalculationNumber: string,
    newQuoteNumber: string,
    newCustomer: string,
    singleCableCalculationIds: string[],
    createdBy: string,
    userId: string
  ): Promise<Calculation> {
    const queryRunner = this.dataSource.createQueryRunner();
    const uniqueIds = [...new Set(singleCableCalculationIds)]; // remove duplicates

    try {
      await queryRunner.startTransaction();

      const newCalculation: Partial<Calculation> = {
        calculationNumber: newCalculationNumber,
        quoteNumber: newQuoteNumber,
        customer: newCustomer,
        calculationFactor: existingCalculation.calculationFactor,
        customerType: existingCalculation.customerType,
        mat017ItemRiskFactor: existingCalculation.mat017ItemRiskFactor,
        mat017ItemAndWorkStepRiskFactor: existingCalculation.mat017ItemAndWorkStepRiskFactor,
        createdBy: createdBy ?? '',
        creationDate: new Date(),
        modificationDate: new Date(),
        modifiedBy: createdBy ?? '',
      };

      let createdCalculation: Calculation = await queryRunner.manager.save(CalculationEntity, newCalculation);

      const existingSingleCableCalculations = await queryRunner.manager.find(SingleCableCalculationEntity, {
        where: uniqueIds.map((id) => ({ id })),
        relations: ['snapshot'],
        order: { assignmentDate: 'ASC' },
      });

      const newSingleCableCalculations: SingleCableCalculationEntity[] = [];

      existingSingleCableCalculations.forEach((scc) => {
        const newSccAssignmentDate = DateUtils.getUniqueTimestamp();

        const newSccEntity = this.singleCableCalculationDataAccessService.createEntity(
          scc.configurationId || scc.snapshot.configurationData.id,
          createdCalculation.id,
          userId,
          scc.batchSize,
          scc.chainflexLength,
          newSccAssignmentDate
        );

        newSingleCableCalculations.push(newSccEntity);
      });

      /**
       * there can be several sccs for each pairing of calculation and configuration
       * but there should/can only be one status for each pairing of calculation and configuration
       *
       * we want to make sure here, that we only create new status entities for sccs with unique combinations
       * of calculationId and configurationId, otherwise we run into query fails which originate from duplicate key
       * violations in calculation_configuration_status table
       * therefore we reduce the calculationConfigurationStatusEntities to only entries with unique calulationId & configurationId
       * pairings and only create new status entities for those
       */
      const calculationConfigurationStatusEntities = [
        ...newSingleCableCalculations
          .reduce((a, c) => {
            a.set(c.configurationId, c);
            return a;
          }, new Map())
          .values(),
      ].map((scc) =>
        this.calculationConfigurationStatusDataAccessService.createFromRepo(
          createdCalculation.id,
          scc.configurationId || scc.snapshot.configurationData.id,
          createdCalculation.createdBy
        )
      );

      await queryRunner.manager.save<SingleCableCalculation[]>(newSingleCableCalculations);
      await queryRunner.manager.save<CalculationConfigurationStatus[]>(calculationConfigurationStatusEntities);

      createdCalculation = await this.queryCalculationById(createdCalculation.id, queryRunner);
      await queryRunner.commitTransaction();

      return createdCalculation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Could not create Calculation with SingleCableCalculations');
    } finally {
      await queryRunner.release();
    }
  }

  public async lockAndCreateConfigurationSnapshots(
    calculationId: string,
    userId: string,
    lockedBy: string
  ): Promise<Calculation> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      let existingCalculation = await queryRunner.manager.findOne(CalculationEntity, {
        where: {
          id: calculationId,
        },
        relations: ['singleCableCalculations', 'singleCableCalculations.configuration'],
      });

      const snapshotEntities: ConfigurationSnapshotEntity[] = [];

      const sccList = existingCalculation.singleCableCalculations;
      const mat017ItemsBaseDataByMatNumber = await this.mat017ItemDataAccessService.generateMat017ItemBaseDataMap(
        getConfigurationDataFromSingleCableCalculations(sccList)
      );

      sccList.forEach((scc) => {
        const snapshotByConfigurationIdExist = snapshotEntities.find(
          (snapshot) => snapshot.isSnapshotOf === scc.configurationId
        );

        const { workStepSet, chainFlexState } = scc.configuration.state;

        const workStepPrices = WorkStepPricesValueObject.create(workStepSet, chainFlexState);

        const { value: workStepPricesValue, error } = workStepPrices.getValue();

        if (error) {
          throw error;
        }

        if (!snapshotByConfigurationIdExist) {
          const newSnapshot = this.configurationSnapshotDataAccessService.createEntity(
            scc.configurationId,
            workStepPricesValue,
            ConfigurationMapper.toSnapshotData(scc.configuration, mat017ItemsBaseDataByMatNumber),
            userId
          );

          snapshotEntities.push(newSnapshot);
        }
      });

      const snapshots = await queryRunner.manager.save<ConfigurationSnapshotEntity>(snapshotEntities);

      existingCalculation = {
        ...existingCalculation,
        status: CalculationStatus.locked,
        lockingDate: new Date(),
        lockedBy,
        singleCableCalculations: existingCalculation.singleCableCalculations.map((scc) => ({
          ...scc,
          snapshotId: snapshots.find((value) => value.isSnapshotOf === scc.configurationId).id,
          configuration: null,
        })),
      };

      const resultCalculation = await queryRunner.manager.save(CalculationEntity, existingCalculation);

      await queryRunner.commitTransaction();

      return resultCalculation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Could not create Calculation with SingleCableCalculations');
    } finally {
      await queryRunner.release();
    }
  }

  public async findOneCalculation(
    where: FindOptionsWhere<Calculation>[] | FindOptionsWhere<Calculation>,
    relations?: string[]
  ): Promise<Calculation> {
    return this.calculationRepository.findOne({
      where,
      relations,
    });
  }

  public async queryCalculationByNumber(calculationNumber: string): Promise<Calculation> {
    return this.calculationRepository
      .createQueryBuilder('calculation')
      .leftJoinAndSelect('calculation.singleCableCalculations', 'singleCableCalculations')
      .where({ calculationNumber })
      .getOne();
  }

  public async queryCalculationById(calculationId: string, queryRunner?: QueryRunner): Promise<Calculation> {
    return this.calculationRepository
      .createQueryBuilder('calculation', queryRunner)
      .leftJoinAndSelect('calculation.singleCableCalculations', 'singleCableCalculations')
      .leftJoinAndSelect('singleCableCalculations.configuration', 'configuration')
      .leftJoinAndSelect('singleCableCalculations.snapshot', 'snapshot')
      .where({ id: calculationId })
      .addOrderBy('singleCableCalculations.assignment_date', 'ASC')
      .getOne();
  }

  public async queryManyCalculationsByCalculationNumberPrefix(calculationNumberPrefix: string): Promise<Calculation[]> {
    return this.calculationRepository
      .createQueryBuilder('calculation')
      .where('calculation.calculationNumber LIKE :prefix', { prefix: `${calculationNumberPrefix}%` })
      .leftJoinAndSelect('calculation.singleCableCalculations', 'singleCableCalculations')
      .getMany();
  }

  public async queryAllCalculations(): Promise<Calculation[]> {
    return this.calculationRepository
      .createQueryBuilder('calculation')
      .leftJoinAndSelect('calculation.singleCableCalculations', 'singleCableCalculations')
      .getMany();
  }

  public createQueryOfCalculationsWithRelations(): SelectQueryBuilder<Calculation> {
    return this.calculationRepository
      .createQueryBuilder('calculation')
      .leftJoinAndSelect('calculation.singleCableCalculations', 'singleCableCalculations')
      .leftJoin('singleCableCalculations.assignedBy', 'assignedBy')
      .addSelect([
        'assignedBy.firstName',
        'assignedBy.lastName',
        'assignedBy.role',
        'assignedBy.email',
        'assignedBy.id',
      ])
      .leftJoinAndSelect('singleCableCalculations.configuration', 'configuration')
      .leftJoinAndSelect('singleCableCalculations.snapshot', 'snapshot');
  }

  public createQueryForSearch(): SelectQueryBuilder<Calculation> {
    return this.calculationRepository
      .createQueryBuilder('calculation')
      .leftJoin('calculation.singleCableCalculations', 'singleCableCalculations')
      .addSelect(['singleCableCalculations.id', 'singleCableCalculations.assignmentDate'])
      .leftJoin('singleCableCalculations.configuration', 'configuration')
      .addSelect('configuration.matNumber')
      .leftJoin('singleCableCalculations.snapshot', 'snapshot')
      .addSelect(['snapshot.id', 'snapshot.configurationData']);
  }
}
