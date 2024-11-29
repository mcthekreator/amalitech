import { AuthDataAccessService } from '@igus/icalc-auth-infrastructure';
import {
  CalculationConfigurationStatusDataAccessService,
  CalculationDataAccessService,
  DbSeedService,
} from '@igus/icalc-calculations-infrastructure';
import {
  ChainflexDataAccessService,
  ConfigurationDataAccessService,
  Mat017ItemDataAccessService,
} from '@igus/icalc-configurations-infrastructure';
import type {
  Calculation,
  Configuration,
  IcalcUser,
  SingleCableCalculation,
  SingleCableCalculationBaseData,
  ChainflexCable,
  Mat017Item,
  Mat017ItemWithWidenData,
  CalculationConfigurationStatus,
} from '@igus/icalc-domain';
import {
  icalcCompleteTestConfigurationWithManyAssignments,
  icalcIncompleteTestCalculation,
  icalcIncompleteTestCalculationWithManyAssignments,
  icalcIncompleteTestConfiguration,
  icalcIncompleteTestConfigurationWithManyAssignments,
  icalcLockedTestCalculation,
  icalcLockedTestCalculationWithManyAssignments,
  icalcLockedTestConfiguration,
  icalcLockedTestConfigurationWithManyAssignments,
  icalcLockedTestSingleCableCalculation,
  icalcTestCalculation,
  icalcTestCalculationForLocking,
  icalcTestCalculationWithManyAssignments,
  icalcTestConfiguration,
  icalcTestConfigurationForLocking,
  icalcTestConfigurationForRemoval,
  icalcTestConfigurationWithManyAssignments,
  icalcTestSingleCableCalculation,
  icalcTestUser,
  icalcTestCalculationForRemoval,
  icalcTestCalculationWithoutOverrides,
  icalcTestConfigurationWithoutOverrides,
  icalcTestConfigurationWithOneAssignment,
  icalcTestCalculationWithOneAssignment,
  icalcTestConfigurationWithUpdatedChainflexPrice,
  icalcTestCalculationWithUpdatedChainflexPrice,
  icalcTestCalculationWithRemovedChainflex,
  icalcTestConfigurationWithRemovedChainflex,
  UserMapper,
  createChainflexCable,
  icalcTestCalculationWithRemovedChainflexWithManyAssignments,
  icalcTestConfigurationWithUpdatedChainflexPriceWithManyAssignments,
  icalcTestCalculationWithUpdatedChainflexPriceWithManyAssignments,
  icalcTestConfigurationWithRemovedChainflexWithManyAssignments,
  icalcTestConfigurationWithNotRemovedChainflexWithManyAssignments,
  icalcTestConfigurationWithNotUpdatedChainflexPriceWithManyAssignments,
  icalcTestConfigurationWithMat017PinAssignment,
  icalcTestCalculationWithMat017PinAssignment,
  getUniqueMat017ItemsFromConfigurations,
  ConfigurationStatus,
  createMat017Item,
  icalcTestConfigurationWithLibraryImageAndMat017PinAssignment,
  icalcTestCalculationWithLibraryImageAndMat017PinAssignment,
  icalcTestCalculationWithLibraryImage,
  icalcTestConfigurationWithLibraryImage,
  icalcTestConfigurationCompleteForMultipleAssignmentToLibraryImage,
  icalcTestConfigurationCompleteForMultipleAssignmentToPinAssignment,
  icalcTestCalculationWithUpdatedMat017ItemPrice,
  icalcTestConfigurationWithUpdatedMat017ItemPrice,
  icalcTestCalculationWithUpdatedMat017ItemPriceInFavorites,
  icalcTestConfigurationWithUpdatedMat017ItemPriceInFavorites,
  icalcTestCalculationWithUpdatedMat017ItemPriceWithManyAssignments,
  icalcTestConfigurationWithUpdatedMat017ItemPriceWithManyAssignments,
  icalcTestConfigurationWithNotUpdatedMat017ItemPriceWithManyAssignments,
  icalcTestCalculationWithRemovedMat017Item,
  icalcTestConfigurationWithRemovedMat017Item,
  icalcTestConfigurationWithNotRemovedMat017ItemWithManyAssignments,
  icalcTestConfigurationWithRemovedMat017ItemWithManyAssignments,
  icalcTestCalculationWithRemovedMat017ItemWithManyAssignments,
  icalcTestCalculationWithManuallyCreatedItem,
  icalcTestConfigurationWithManuallyCreatedItem,
} from '@igus/icalc-domain';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import type { DeepPartial } from 'typeorm';
import { formatDbSeedResponse } from '../db-seed.helpers';
import type { NestedPartial } from 'merge-partially';

export interface DbSeedCalculationAndConfigurationOptions {
  incomplete?: string;
  forLocking?: string;
  locked?: string;
  approved?: string;
  manyAssignments?: string;
  oneAssignment?: string;
  forRemoval?: string;
  withoutOverrides?: string;
  updatedChainflexPrice?: string;
  updatedMat017ItemPriceInFavorites?: string;
  removedChainflex?: string;
  updatedMat017ItemPrice?: string;
  removedMat017Item?: string;
  mat017PinAssignment?: string;
  imageInLibrary?: string;
  removedMat017ItemOnLeftConnector?: string;
  addNotSelectedMat017Item?: string;
  applyMat017ItemToRight?: string;
  manuallyCreatedMat017Item?: string;
}

@SubCommand({
  name: 'calculation-and-configuration',
  description: 'generates basic set of test data (calculation, configuration, scc, status) - icalc test user required',
})
export class CalculationAndConfigurationCommand extends CommandRunner {
  constructor(
    private readonly calculationDataAccessService: CalculationDataAccessService,
    private readonly calculationConfigurationStatusDataAccessService: CalculationConfigurationStatusDataAccessService,
    private readonly configurationDataAccessService: ConfigurationDataAccessService,
    private readonly chainflexAccessService: ChainflexDataAccessService,
    private readonly mat017ItemAccessService: Mat017ItemDataAccessService,
    private readonly authDataAccessService: AuthDataAccessService,
    private readonly dbSeedService: DbSeedService
  ) {
    super();
  }

  @Option({
    flags: '-m, --manyAssignments',
    description: 'manyAssignments',
    required: false,
    defaultValue: false,
  })
  public parseManyAssignments(): boolean {
    return true;
  }

  @Option({
    flags: '-o, --oneAssignment',
    description: 'oneAssignment',
    required: false,
    defaultValue: false,
  })
  public parseOneAssignment(): boolean {
    return true;
  }

  @Option({
    flags: '-i, --incomplete',
    description: 'incomplete',
    required: false,
    defaultValue: false,
  })
  public parseIncomplete(): boolean {
    return true;
  }

  @Option({
    flags: '-f, --forLocking',
    description: 'forLocking',
    required: false,
    defaultValue: false,
  })
  public parseForLocking(): boolean {
    return true;
  }

  @Option({
    flags: '-l, --locked',
    description: 'locked',
    required: false,
    defaultValue: false,
  })
  public parseLocked(): boolean {
    return true;
  }

  @Option({
    flags: '-ap, --approved',
    description: 'approved',
    required: false,
    defaultValue: false,
  })
  public parseApproved(): boolean {
    return true;
  }

  @Option({
    flags: '-fr, --forRemoval',
    description: 'forRemoval',
    required: false,
    defaultValue: false,
  })
  public parseForRemoval(): boolean {
    return true;
  }

  @Option({
    flags: '-wo, --withoutOverrides',
    description: 'withoutOverrides',
    required: false,
    defaultValue: false,
  })
  public parseWithoutOverrides(): boolean {
    return true;
  }

  @Option({
    flags: '-ucp, --updatedChainflexPrice',
    description: 'updatedChainflexPrice',
    required: false,
    defaultValue: false,
  })
  public parseUpdatedChainflexPrice(): boolean {
    return true;
  }

  @Option({
    flags: '-ump, --updatedMat017ItemPrice',
    description: 'updatedMat017ItemPrice',
    required: false,
    defaultValue: false,
  })
  public parseUpdatedMat017ItemPrice(): boolean {
    return true;
  }

  @Option({
    flags: '-umpf, --updatedMat017ItemPriceInFavorites',
    description: 'updatedMat017ItemPriceInFavorites',
    required: false,
    defaultValue: false,
  })
  public parseUpdatedMat017ItemPriceInFavorites(): boolean {
    return true;
  }

  @Option({
    flags: '-rmi, --removedMat017Item',
    description: 'removedMat017Item',
    required: false,
    defaultValue: false,
  })
  public parseRemovedMat017Item(): boolean {
    return true;
  }

  @Option({
    flags: '-rmc, --removedChainflex',
    description: 'removedChainflex',
    required: false,
    defaultValue: false,
  })
  public parseRemovedChainflex(): boolean {
    return true;
  }

  @Option({
    flags: '-mat017PA, --mat017PinAssignment',
    description: 'mat017PinAssignment',
    required: false,
    defaultValue: false,
  })
  public parseMat017PinAssignment(): boolean {
    return true;
  }

  @Option({
    flags: '-img, --imageInLibrary',
    description: 'imageInLibrary',
    required: false,
    defaultValue: false,
  })
  public parseImageInLibrary(): boolean {
    return true;
  }

  @Option({
    flags: '-rmMat017L, --removedMat017ItemOnLeftConnector',
    description: 'removes all mat017 items for leftConnector selection',
    required: false,
    defaultValue: false,
  })
  public parseRemovedMat017ItemOnLeftConnector(): boolean {
    return true;
  }

  @Option({
    flags: '-addNSM017, --addNotSelectedMat017Item',
    description:
      'adds a mat017 item to pin assignment or library (applies only to imageInLibrary or mat017PinAssignment options)',
    required: false,
    defaultValue: false,
  })
  public parseAddNotSelectedMat017Item(): boolean {
    return true;
  }

  @Option({
    flags: '-mat017R, --applyMat017ItemToRight',
    description:
      'applies mat017 item from left to right (applies only to imageInLibrary or mat017PinAssignment option)',
    required: false,
    defaultValue: false,
  })
  public parseApplyMat017ItemToRight(): boolean {
    return true;
  }

  @Option({
    flags: '-manCreated, --manuallyCreatedMat017Item',
    description:
      'creates a calculation and configuration that has a manually added mat017 item selected for left connector',
    required: false,
    defaultValue: false,
  })
  public parseManuallyCreatedMat017Item(): boolean {
    return true;
  }

  public async run(passedParam: string[], options?: DbSeedCalculationAndConfigurationOptions): Promise<void> {
    const additionalParameter = passedParam[0];

    if (additionalParameter) {
      console.log(formatDbSeedResponse('error', `unknown sub-command: ${additionalParameter}`));
      return;
    }

    let testCalculation: Partial<Calculation>;
    let testConfiguration: Partial<Configuration>;
    let testSCC: Partial<SingleCableCalculation>;
    let manyAssignments = false;
    let setLocked = false;
    let removedChainflex: DeepPartial<ChainflexCable>;
    let additionalConfiguration: Partial<Configuration>;
    const setApproved = options?.approved;

    if (options?.manyAssignments) {
      testCalculation = icalcTestCalculationWithManyAssignments;
      testConfiguration = icalcTestConfigurationWithManyAssignments;
      testSCC = { ...icalcTestSingleCableCalculation };
      manyAssignments = true;
    }
    if (options?.oneAssignment) {
      testCalculation = icalcTestCalculationWithOneAssignment;
      testConfiguration = icalcTestConfigurationWithOneAssignment;
      testSCC = { ...icalcTestSingleCableCalculation };
    } else if (options?.mat017PinAssignment && options?.imageInLibrary) {
      testCalculation = icalcTestCalculationWithLibraryImageAndMat017PinAssignment;
      testConfiguration = icalcTestConfigurationWithLibraryImageAndMat017PinAssignment;
      testSCC = icalcTestSingleCableCalculation;
    } else if (options?.mat017PinAssignment) {
      testCalculation = icalcTestCalculationWithMat017PinAssignment;
      testSCC = icalcTestSingleCableCalculation;
      if (manyAssignments) {
        testConfiguration = icalcTestConfigurationCompleteForMultipleAssignmentToPinAssignment;
        additionalConfiguration = icalcTestConfigurationWithMat017PinAssignment;
        if (options?.addNotSelectedMat017Item)
          additionalConfiguration.state.pinAssignmentState.actionModels['0'].left.mat017Item = 'DIFFERENTMAT017';
        if (options?.applyMat017ItemToRight)
          additionalConfiguration.state.pinAssignmentState.actionModels['0'].right =
            additionalConfiguration.state.pinAssignmentState.actionModels['0'].left;
      } else {
        testConfiguration = icalcTestConfigurationWithMat017PinAssignment;
      }
    } else if (options?.imageInLibrary) {
      testCalculation = icalcTestCalculationWithLibraryImage;
      testSCC = icalcTestSingleCableCalculation;
      if (manyAssignments) {
        testConfiguration = icalcTestConfigurationCompleteForMultipleAssignmentToLibraryImage;
        additionalConfiguration = icalcTestConfigurationWithLibraryImage;
        if (options?.addNotSelectedMat017Item)
          additionalConfiguration.state.libraryState.imageList[0].matNumber = 'DIFFERENTMAT017';
        if (options?.applyMat017ItemToRight) {
          additionalConfiguration.state.libraryState.imageList[0].side = 'right';
          additionalConfiguration.state.connectorState.rightConnector.mat017ItemListWithWidenData = [];
          additionalConfiguration.state.connectorState.rightConnector.addedMat017Items = {};
        }
      } else testConfiguration = icalcTestConfigurationWithLibraryImage;
    } else if (options?.incomplete && !manyAssignments) {
      testCalculation = icalcIncompleteTestCalculation;
      testConfiguration = icalcIncompleteTestConfiguration;
      testSCC = { ...icalcTestSingleCableCalculation };
    } else if (options?.incomplete && manyAssignments) {
      testCalculation = icalcIncompleteTestCalculationWithManyAssignments;
      testConfiguration = icalcCompleteTestConfigurationWithManyAssignments;
      testSCC = { ...icalcTestSingleCableCalculation };
      additionalConfiguration = icalcIncompleteTestConfigurationWithManyAssignments;
    } else if (options?.forLocking) {
      testCalculation = icalcTestCalculationForLocking;
      testConfiguration = icalcTestConfigurationForLocking;
      testSCC = {
        ...icalcTestSingleCableCalculation,
        commercialWorkStepOverrides: { projektierung: 2 },
      };
    } else if (options?.locked && !manyAssignments) {
      testCalculation = icalcLockedTestCalculation;
      testConfiguration = icalcLockedTestConfiguration;
      testSCC = icalcLockedTestSingleCableCalculation;
      setLocked = true;
    } else if (options?.locked && manyAssignments) {
      testCalculation = icalcLockedTestCalculationWithManyAssignments;
      testConfiguration = icalcLockedTestConfigurationWithManyAssignments;
      testSCC = icalcLockedTestSingleCableCalculation;
      setLocked = true;
    } else if (options?.forRemoval) {
      testCalculation = icalcTestCalculationForRemoval;
      testConfiguration = icalcTestConfigurationForRemoval;
      testSCC = { ...icalcTestSingleCableCalculation };
      manyAssignments = true;
    } else if (options?.withoutOverrides) {
      testCalculation = icalcTestCalculationWithoutOverrides;
      testConfiguration = icalcTestConfigurationWithoutOverrides;
      testSCC = { ...icalcTestSingleCableCalculation };
    } else if (options?.updatedMat017ItemPrice && !manyAssignments) {
      testCalculation = icalcTestCalculationWithUpdatedMat017ItemPrice;
      testConfiguration = icalcTestConfigurationWithUpdatedMat017ItemPrice;
      testSCC = { ...icalcTestSingleCableCalculation };
    } else if (options?.updatedMat017ItemPrice && manyAssignments) {
      testCalculation = icalcTestCalculationWithUpdatedMat017ItemPriceWithManyAssignments;
      testConfiguration = icalcTestConfigurationWithUpdatedMat017ItemPriceWithManyAssignments;
      testSCC = { ...icalcTestSingleCableCalculation };
      additionalConfiguration = icalcTestConfigurationWithNotUpdatedMat017ItemPriceWithManyAssignments;
    } else if (options?.removedMat017Item && !manyAssignments) {
      testCalculation = icalcTestCalculationWithRemovedMat017Item;
      testConfiguration = icalcTestConfigurationWithRemovedMat017Item;
      testSCC = { ...icalcTestSingleCableCalculation };
    } else if (options?.removedMat017Item && manyAssignments) {
      testCalculation = icalcTestCalculationWithRemovedMat017ItemWithManyAssignments;
      testConfiguration = icalcTestConfigurationWithRemovedMat017ItemWithManyAssignments;
      testSCC = { ...icalcTestSingleCableCalculation };
      additionalConfiguration = icalcTestConfigurationWithNotRemovedMat017ItemWithManyAssignments;
    } else if (options?.updatedChainflexPrice && !manyAssignments) {
      testCalculation = icalcTestCalculationWithUpdatedChainflexPrice;
      testConfiguration = icalcTestConfigurationWithUpdatedChainflexPrice;
      testSCC = { ...icalcTestSingleCableCalculation };
    } else if (options?.updatedChainflexPrice && manyAssignments) {
      testCalculation = icalcTestCalculationWithUpdatedChainflexPriceWithManyAssignments;
      testConfiguration = icalcTestConfigurationWithUpdatedChainflexPriceWithManyAssignments;
      testSCC = { ...icalcTestSingleCableCalculation };
      additionalConfiguration = icalcTestConfigurationWithNotUpdatedChainflexPriceWithManyAssignments;
    } else if (options?.removedChainflex && !manyAssignments) {
      testCalculation = icalcTestCalculationWithRemovedChainflex;
      testConfiguration = icalcTestConfigurationWithRemovedChainflex;
      testSCC = { ...icalcTestSingleCableCalculation };
      removedChainflex = testConfiguration.state.chainFlexState.chainflexCable;
    } else if (options?.removedChainflex && manyAssignments) {
      testCalculation = icalcTestCalculationWithRemovedChainflexWithManyAssignments;
      testConfiguration = icalcTestConfigurationWithRemovedChainflexWithManyAssignments;
      testSCC = { ...icalcTestSingleCableCalculation };
      removedChainflex = testConfiguration.state.chainFlexState.chainflexCable;
      additionalConfiguration = icalcTestConfigurationWithNotRemovedChainflexWithManyAssignments;
    } else if (options?.updatedMat017ItemPriceInFavorites) {
      testCalculation = icalcTestCalculationWithUpdatedMat017ItemPriceInFavorites;
      testConfiguration = icalcTestConfigurationWithUpdatedMat017ItemPriceInFavorites;
      testSCC = { ...icalcTestSingleCableCalculation };
    } else if (options?.manuallyCreatedMat017Item) {
      testCalculation = icalcTestCalculationWithManuallyCreatedItem;
      testConfiguration = icalcTestConfigurationWithManuallyCreatedItem;
      testSCC = icalcTestSingleCableCalculation;
    }
    // all changes to options should be introduced above this
    else if (!manyAssignments) {
      testCalculation = icalcTestCalculation;
      testConfiguration = icalcTestConfiguration;
      testSCC = icalcTestSingleCableCalculation;
    }
    if (options?.removedMat017ItemOnLeftConnector) {
      additionalConfiguration.state.connectorState.leftConnector = undefined;
    }

    await this.deleteExistingCalculation(testCalculation);

    try {
      if (removedChainflex) {
        await this.createRemovedChainflexCable(removedChainflex);
      }

      await this.saveNotExistentMat017Items(testConfiguration);

      const fullUser = await this.authDataAccessService.findUserByEmail(icalcTestUser.email);
      const { calculation, configuration: savedConfiguration } = await this.createCalculationAndConfiguration(
        testCalculation,
        fullUser,
        testConfiguration,
        testSCC
      );
      let configuration = savedConfiguration;

      if (setApproved) {
        await this.setConfigurationStatusToApproved(calculation.id, configuration.id, UserMapper.toUserName(fullUser));
      }

      if (additionalConfiguration) {
        configuration = await this.createAdditionalConfiguration(additionalConfiguration, fullUser);
      }

      if (manyAssignments) {
        await this.addAssignments(configuration, calculation, fullUser);
      }

      if (setLocked) {
        await this.lockCalculation(calculation.id, fullUser);
      }

      const data = await this.buildDataObject(testCalculation.calculationNumber, testConfiguration.matNumber);

      console.log(formatDbSeedResponse('ok', 'created basic set of test data', data));
    } catch (error) {
      console.log(formatDbSeedResponse('error', 'could not generate basic set of test data', error));
    }
  }

  private async deleteExistingCalculation(testCalculation: Partial<Calculation>): Promise<void> {
    const existingTestCalculation = await this.calculationDataAccessService.queryCalculationByNumber(
      testCalculation.calculationNumber
    );

    if (existingTestCalculation) {
      try {
        await this.dbSeedService.deleteCalculationAndConfigurationsTransactional(existingTestCalculation);
      } catch (error) {
        console.log(formatDbSeedResponse('error', 'could not delete existing test data', error));
      }
    }
  }

  private async createRemovedChainflexCable(removedChainflex: DeepPartial<ChainflexCable>): Promise<void> {
    const removedChainflexEntity: NestedPartial<ChainflexCable> = {
      price: { germanListPrice: undefined },
      partNumber: removedChainflex.partNumber,
    };

    await this.chainflexAccessService.saveOne(createChainflexCable(removedChainflexEntity));
  }

  private async setConfigurationStatusToApproved(
    calculationId: string,
    configurationId,
    modifiedBy: string
  ): Promise<CalculationConfigurationStatus> {
    const calculationConfigurationStatusEntity = this.calculationConfigurationStatusDataAccessService.createFromRepo(
      calculationId,
      configurationId,
      modifiedBy
    );

    calculationConfigurationStatusEntity.status = ConfigurationStatus.approved;
    return this.calculationConfigurationStatusDataAccessService.save(calculationConfigurationStatusEntity);
  }

  private async createCalculationAndConfiguration(
    testCalculation: Partial<Calculation>,
    fullUser: IcalcUser,
    testConfiguration: Partial<Configuration>,
    testSCC: Partial<SingleCableCalculation>
  ): Promise<{ calculation: Calculation; configuration: Configuration }> {
    const calculationEntity = this.calculationDataAccessService.createFromRepo({
      ...testCalculation,
      createdBy: UserMapper.toUserName(fullUser),
      modifiedBy: UserMapper.toUserName(fullUser),
    });
    const configurationEntity = this.configurationDataAccessService.createFromRepo({
      ...testConfiguration,
      createdBy: UserMapper.toUserName(fullUser),
      modifiedBy: UserMapper.toUserName(fullUser),
    });

    return this.calculationDataAccessService.createNewCalculationAndConfigurationTransactional(
      calculationEntity,
      configurationEntity,
      testSCC,
      fullUser
    );
  }

  private async createAdditionalConfiguration(
    configuration: Partial<Configuration>,
    fullUser: IcalcUser
  ): Promise<Configuration> {
    configuration = this.configurationDataAccessService.createFromRepo({
      ...configuration,
      createdBy: UserMapper.toUserName(fullUser),
      modifiedBy: UserMapper.toUserName(fullUser),
    });

    return this.configurationDataAccessService.save(configuration);
  }

  private async addAssignments(
    configuration: Configuration,
    calculation: Calculation,
    fullUser: IcalcUser
  ): Promise<void> {
    const newAssignmentData: SingleCableCalculationBaseData = {
      chainflexLength: 2,
      batchSize: 2,
    };

    await this.calculationDataAccessService.linkExistingConfigurationTransactional(
      configuration,
      calculation,
      fullUser,
      newAssignmentData.batchSize,
      newAssignmentData.chainflexLength
    );
  }

  private async lockCalculation(calculationId: string, fullUser: IcalcUser): Promise<void> {
    const updatedCalculation: DeepPartial<Calculation> = {
      id: calculationId,
      productionPlanExcelDownloaded: true,
      calculationExcelDownloaded: true,
      modificationDate: new Date(),
      modifiedBy: UserMapper.toUserName(fullUser),
    };

    const savedCalculation = await this.calculationDataAccessService.save(updatedCalculation);

    const reloadedCalculation = await this.calculationDataAccessService.findOneCalculation({
      id: savedCalculation.id,
    });

    if (reloadedCalculation.calculationExcelDownloaded && reloadedCalculation.productionPlanExcelDownloaded) {
      await this.calculationDataAccessService.lockAndCreateConfigurationSnapshots(
        savedCalculation.id,
        fullUser.id,
        UserMapper.toUserName(fullUser)
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async buildDataObject(calculationNumber: string, matNumber: string): Promise<any> {
    const calculation = await this.calculationDataAccessService.findOneCalculation(
      {
        calculationNumber,
      },
      ['singleCableCalculations', 'singleCableCalculations.snapshot']
    );

    const configuration = await this.configurationDataAccessService.findOneByMatNumber(matNumber);

    return {
      calculation: {
        [calculation.calculationNumber]: {
          id: calculation.id,
          configurationId: configuration.id,
          singleCableCalculations: calculation.singleCableCalculations.map((scc) => ({
            id: scc.id,
            calculationId: calculation.id,
            configurationId: scc.configurationId,
            snapshotId: scc.snapshotId,
            snapshot: scc.snapshot,
            batchSize: scc.batchSize,
            chainflexLength: scc.chainflexLength,
          })),
        },
      },
      configuration: {
        [configuration.matNumber]: {
          id: configuration.id,
          state: configuration.state,
          labelingLeft: configuration.labelingLeft,
          labelingRight: configuration.labelingRight,
          partNumber: configuration.partNumber,
        },
      },
    };
  }

  private async saveNotExistentMat017Items(testConfiguration: Partial<Configuration>): Promise<Mat017Item[]> {
    const results = new Array<Promise<Mat017Item>>();
    const mat017ItemsInConfiguration = getUniqueMat017ItemsFromConfigurations([
      testConfiguration as Configuration,
    ]) as Mat017ItemWithWidenData[];
    const mat017ItemNumbersInConfiguration = mat017ItemsInConfiguration.map((item) => item.matNumber);
    const mat017ItemNumbersInConfigAndDB = (
      await this.mat017ItemAccessService.findManyByMatNumbers(mat017ItemNumbersInConfiguration)
    ).map((item) => item.matNumber);

    for (let i = 0; i < mat017ItemsInConfiguration.length; i++) {
      if (!mat017ItemNumbersInConfigAndDB.includes(mat017ItemNumbersInConfiguration[i])) {
        const newMat017Item = createMat017Item(mat017ItemsInConfiguration[i]);

        results.push(this.mat017ItemAccessService.saveOne(newMat017Item));
      }
    }
    return Promise.all(results);
  }
}
