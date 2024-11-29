import { CalculationStatus } from '@igus/icalc-domain';
import type {
  Calculation,
  Configuration,
  SingleCableCalculation,
  SaveSingleCableCalculationResult,
  IcalcLibrary,
  SaveConfigurationData,
  SaveSnapshotData,
  UpdateChainflexPricesResult,
  CheckForNewChainflexPricesResult,
  ChainflexPrice,
  RemoveChainflexDataResult,
  WorkStepSet,
  ConfigurationConnectorStatePresentation,
} from '@igus/icalc-domain';
import { ConfigurationEntity } from '@igus/icalc-entities';
import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { AuthDataAccessService } from '@igus/icalc-auth-infrastructure';
import { SingleCableCalculationDataAccessService } from '@igus/icalc-calculations-infrastructure';
import { StateChangeCheckService } from './state-change-check.service';
import { StatusService } from './status.service';
import { ChainflexPriceChangeCheckService } from './chainflex-price-change-check.service';
import { CheckForNewChainflexPricesResultBuilder } from './check-for-new-chainflex-prices-result-builder';
import { UpdateChainflexPricesResultBuilder } from './update-chainflex-prices-result-builder';
import { RemoveChainflexDataResultBuilder } from './remove-chainflex-data-result-builder';

@Injectable()
export class SingleCableCalculationService {
  constructor(
    private readonly singleCableCalculationDataAccessService: SingleCableCalculationDataAccessService,
    private readonly stateChangeCheckService: StateChangeCheckService,
    private readonly statusService: StatusService,
    private readonly authDataAccessService: AuthDataAccessService,
    private readonly chainflexPriceChangeCheckService: ChainflexPriceChangeCheckService
  ) {}

  public async createAndSaveSingleCableCalculation(
    configuration: Configuration,
    calculation: Calculation,
    userId: string,
    singleCableCalculationProps: Partial<SingleCableCalculation>
  ): Promise<SingleCableCalculation> {
    const scc = this.singleCableCalculationDataAccessService.createFromRepo(
      configuration,
      calculation,
      userId,
      singleCableCalculationProps.batchSize,
      singleCableCalculationProps.chainflexLength
    );

    return this.singleCableCalculationDataAccessService.save(scc);
  }

  public async saveSingleCableCalculation(
    userId: string,
    singleCableCalculationId: string,
    singleCableCalculationProps: Partial<SingleCableCalculation>,
    modifiedConfiguration?: SaveConfigurationData,
    modifiedSnapshot?: SaveSnapshotData
  ): Promise<SaveSingleCableCalculationResult> {
    const existingScc = await this.singleCableCalculationDataAccessService.findOneById(singleCableCalculationId);

    if (!existingScc) {
      throw new NotFoundException('SingleCableCalculation to be saved does not exist.');
    }

    const isLocked = existingScc.calculation.status === CalculationStatus.locked;

    if (isLocked) {
      if (modifiedConfiguration || !modifiedSnapshot) {
        throw new NotAcceptableException('must provide a snapshot to save, since calculation is locked');
      }

      if (existingScc.snapshot && existingScc.snapshotId !== modifiedSnapshot.id) {
        throw new NotFoundException('Provided snapshot is not assigend to this SingleCableCalculation');
      }

      return this.saveWithSnapshot(
        userId,
        existingScc,
        modifiedSnapshot?.libraryState,
        modifiedSnapshot?.connectorState
      );
    }

    if (!modifiedConfiguration || modifiedSnapshot) {
      throw new NotAcceptableException('must provide a configuration to save, since calculation is unlocked');
    }

    if (existingScc.configuration && existingScc.configuration.id !== modifiedConfiguration.id) {
      throw new NotFoundException('Provided configuration is not assigend to this SingleCableCalculation');
    }

    return this.saveWithConfiguration(userId, existingScc, singleCableCalculationProps, modifiedConfiguration);
  }

  public async getOne({
    calculationId,
    configurationId,
    singleCableCalculationId,
  }: Record<string, string>): Promise<SingleCableCalculation> {
    if (!calculationId && !configurationId && !singleCableCalculationId) {
      throw new BadRequestException(`Either calculationId or configurationId is required.`);
    }

    if (calculationId && configurationId) {
      throw new BadRequestException(`Both calculationId and configurationId cannot be used at the same time.`);
    }

    if (singleCableCalculationId) {
      return this.singleCableCalculationDataAccessService.findOneBySingleCableCalculationId(singleCableCalculationId);
    }

    if (configurationId) {
      return this.singleCableCalculationDataAccessService.findOneByConfigurationId(configurationId);
    }

    return this.singleCableCalculationDataAccessService.findOneByCalculationId(calculationId);
  }

  public async getMany(singleCableCalculationIds: string[]): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationDataAccessService.findManyByIds(singleCableCalculationIds);
  }

  public async checkChainflexAndPriceExistence(
    singleCableCalculationIds: string[]
  ): Promise<CheckForNewChainflexPricesResult> {
    const resultBuilder = new CheckForNewChainflexPricesResultBuilder();

    for (const sccId of singleCableCalculationIds) {
      const scc = await this.singleCableCalculationDataAccessService.findOneById(sccId);

      if (!scc) {
        throw new NotFoundException('No SingleCableCalculation with provided id found.');
      }

      const isLocked = scc.calculation.status === CalculationStatus.locked;

      if (isLocked) {
        throw new NotAcceptableException('CF price deviations are not relevant for locked calculations');
      }
      const deviation = await this.chainflexPriceChangeCheckService.deviationDetected(
        scc.configuration?.state?.chainFlexState?.chainflexCable
      );

      resultBuilder.addNewPriceUpdateReference(scc, deviation);
    }

    return resultBuilder.getResult();
  }

  public async updateChainflexPrices(
    userId: string,
    singleCableCalculationIds: string[]
  ): Promise<UpdateChainflexPricesResult> {
    const resultBuilder = new UpdateChainflexPricesResultBuilder();

    for (const sccId of singleCableCalculationIds) {
      const scc = await this.singleCableCalculationDataAccessService.findOneById(sccId);

      if (!scc) {
        throw new NotFoundException('No SingleCableCalculation with provided id found.');
      }

      const isLocked = scc.calculation.status === CalculationStatus.locked;

      if (isLocked) {
        throw new NotAcceptableException('CF price update is not available for locked calculations');
      }

      const alreadyHandled = resultBuilder.hasHandledGivenConfigurationId(scc.configurationId);

      if (alreadyHandled) {
        // on db level a price deviation only has to be handled once per configuration (not per scc), updateReferences can be reused
        resultBuilder.addPriceUpdateReferenceFromExistingReference(scc);
      } else {
        const deviation = await this.chainflexPriceChangeCheckService.deviationDetected(
          scc.configuration?.state?.chainFlexState?.chainflexCable
        );

        const reference = resultBuilder.addNewPriceUpdateReference(scc, deviation);

        if (reference.newPriceObject) {
          await this.saveWithUpdatedChainflexPrice(userId, scc, reference.newPriceObject);
        }
      }
    }

    return resultBuilder.getResult();
  }

  public async removeChainflexData(
    userId: string,
    singleCableCalculationIds: string[]
  ): Promise<RemoveChainflexDataResult> {
    const resultBuilder = new RemoveChainflexDataResultBuilder();

    for (const sccId of singleCableCalculationIds) {
      const scc = await this.singleCableCalculationDataAccessService.findOneById(sccId);

      if (!scc) {
        throw new NotFoundException('No SingleCableCalculation with provided id found.');
      }

      const isLocked = scc.calculation.status === CalculationStatus.locked;

      if (isLocked) {
        throw new NotAcceptableException('CF data removal is not available for locked calculations');
      }

      const alreadyHandled = resultBuilder.hasHandledGivenConfigurationId(scc.configurationId);

      if (alreadyHandled) {
        // on db level a price deviation only has to be handled once per configuration (not per scc)
        resultBuilder.addSaveSingleCableCalculationResultFromExistingResult(scc);
      } else {
        const sccResult = await this.saveWithRemovedChainflexData(userId, scc);

        resultBuilder.addSaveSingleCableCalculationResult(sccResult);
      }
    }

    return resultBuilder.getResult();
  }

  private async saveWithConfiguration(
    userId: string,
    existingScc: SingleCableCalculation,
    singleCableCalculationProps: Partial<SingleCableCalculation>,
    modifiedConfiguration: SaveConfigurationData
  ): Promise<SaveSingleCableCalculationResult> {
    const oldWorkStepSet: WorkStepSet = existingScc.configuration.state.workStepSet;
    const modifiedConfigurationState = modifiedConfiguration?.state || {};
    const newWorkStepSet: WorkStepSet = modifiedConfiguration.state?.workStepSet;
    const hasWorkStepSetChanged = Boolean(newWorkStepSet) && oldWorkStepSet !== newWorkStepSet;
    const modifiedBy = await this.authDataAccessService.getUserAsStringById(userId);

    const configurationEntity = new ConfigurationEntity();

    Object.assign(configurationEntity, modifiedConfiguration, {
      partNumber: modifiedConfiguration.state?.chainFlexState?.chainflexCable?.partNumber,
      modifiedBy,
      modificationDate: new Date(),
    });

    configurationEntity.state = {
      ...configurationEntity.state,
      ...modifiedConfigurationState,
      ...(hasWorkStepSetChanged && { workStepOverrides: {} }),
    };

    const sccProps = {
      ...existingScc,
      ...singleCableCalculationProps,
      configurationId: modifiedConfiguration.id,
    };

    const { state, ...rest } = modifiedConfiguration;

    const hasApprovalRevokingDataBeenChanged = this.stateChangeCheckService.changeDetected(
      existingScc?.configuration,
      rest,
      state
    );

    const singleCableCalculation =
      await this.singleCableCalculationDataAccessService.saveWithConfigurationTransactional(
        sccProps,
        configurationEntity
      );

    if (!hasApprovalRevokingDataBeenChanged) {
      return {
        singleCableCalculation,
        calculationConfigurationStatus: {
          hasApprovalBeenRevoked: false,
        },
      };
    }

    const { hasApprovalBeenRevoked } = await this.statusService.resetApprovalIfStatusApproved(
      userId,
      existingScc.calculation.id,
      existingScc.configuration.id
    );

    return {
      singleCableCalculation,
      calculationConfigurationStatus: {
        hasApprovalBeenRevoked,
      },
    };
  }

  private async saveWithSnapshot(
    userId: string,
    existingScc: SingleCableCalculation,
    modifiedLibraryState: IcalcLibrary,
    modifiedConnectorState: ConfigurationConnectorStatePresentation
  ): Promise<SaveSingleCableCalculationResult> {
    const fullUser = await this.authDataAccessService.findUserById(userId);
    const response = await this.singleCableCalculationDataAccessService.saveWithSnapshotTransactional(
      fullUser,
      existingScc,
      modifiedLibraryState,
      modifiedConnectorState
    );

    return {
      singleCableCalculation: response,
      calculationConfigurationStatus: {
        hasApprovalBeenRevoked: false,
      },
    };
  }

  private async saveWithUpdatedChainflexPrice(
    userId: string,
    scc: SingleCableCalculation,
    newPrice: ChainflexPrice
  ): Promise<SaveSingleCableCalculationResult> {
    const modifiedBy = await this.authDataAccessService.getUserAsStringById(userId);
    const response = await this.singleCableCalculationDataAccessService.updateChainflexPriceTransactional(
      scc,
      newPrice,
      modifiedBy
    );

    return {
      singleCableCalculation: response,
      calculationConfigurationStatus: {
        hasApprovalBeenRevoked: false,
      },
    };
  }

  private async saveWithRemovedChainflexData(
    userId: string,
    scc: SingleCableCalculation
  ): Promise<SaveSingleCableCalculationResult> {
    const modifiedBy = await this.authDataAccessService.getUserAsStringById(userId);
    const response = await this.singleCableCalculationDataAccessService.removeChainflexDataTransactional(
      scc,
      modifiedBy
    );

    const { hasApprovalBeenRevoked } = await this.statusService.resetApprovalIfStatusApproved(
      userId,
      scc.calculation.id,
      scc.configuration.id
    );

    return {
      singleCableCalculation: response,
      calculationConfigurationStatus: {
        hasApprovalBeenRevoked,
      },
    };
  }
}
