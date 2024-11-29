import { Mat017ItemStatus, type Calculation, type Configuration } from '../models';
import { createPartialConfiguration } from '../factories/objects/configuration';
import { createPartialCalculation } from '../factories/objects/calculation';
import {
  createIcalcTestConnectorState,
  createIcalcTestRedactedMat017ItemWithWidenData,
  icalcTestConnectorState,
} from '../factories/objects/test/connector-state';
import { icalcTestSingleCableCalculation } from '../factories/objects/test/single-cable-calculation';
import { ICALC_DYNAMIC_CALC_NUMBER_PREFIX, ICALC_DYNAMIC_MAT_NUMBER_PREFIX } from '../constants';
import { createConfigurationState } from '../factories/objects';

export const icalcTestCalculation: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculation-unlikely-calculationNumber`,
  quoteNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculation-unlikely-quote-number`,
  customer: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculation-unlikely-customer`,
});
export const icalcTestConfiguration: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfiguration-unlikely-matNumber`,
  state: {
    workStepOverrides: {
      consignment: 4,
      crimp: 2,
    },
  },
});
// "COMPLETE / VALID" with many assignments
export const icalcTestCalculationWithManyAssignments: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithManyAssignments-unlikely-calculationNumber`,
});
export const icalcTestConfigurationWithManyAssignments: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationWithManyAssignments-unlikely-matNumber`,
});
// "COMPLETE / VALID" with one assignment
export const icalcTestCalculationWithOneAssignment: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithOneAssignment-unlikely-calculationNumber`,
});
export const icalcTestConfigurationWithOneAssignment: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationWithOneAssignment-unlikely-matNumber`,
});
// "COMPLETE / VALID" for locking
export const icalcTestCalculationForLocking: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationForLocking-unlikely-calculationNumber`,
});
export const icalcTestConfigurationForLocking: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationForLocking-unlikely-matNumber`,
});
// "COMPLETE / VALID" locked
export const icalcLockedTestCalculation: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcLockedTestCalculation-unlikely-calculationNumber`,
  quoteNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcLockedTestCalculation-unlikely-quoteNumber`,
  customer: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcLockedTestCalculation-unlikely-customer`,
  calculationFactor: 2,
});
export const icalcLockedTestConfiguration: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcLockedTestConfiguration-unlikely-matNumber`,
});
// "COMPLETE / VALID" locked with many assignments
export const icalcLockedTestCalculationWithManyAssignments: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcLockedTestCalculationWithManyAssignments-unlikely-calculationNumber`,
});
export const icalcLockedTestConfigurationWithManyAssignments: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcLockedTestConfigurationWithManyAssignments-unlikely-matNumber`,
});
// INCOMPLETE / INVALID
export const icalcIncompleteTestCalculation: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestCalculation-unlikely-calculationNumber`,
});
export const icalcIncompleteTestConfiguration: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-matNumber`,
  state: {
    pinAssignmentState: {
      actionModels: undefined,
    },
  },
});
// "COMPLETE / VALID" for removal
export const icalcTestCalculationForRemoval: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationForRemoval-unlikely-calculationNumber`,
});
export const icalcTestConfigurationForRemoval: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationForRemoval-unlikely-matNumber`,
});
// "COMPLETE / VALID" without overrides
export const icalcTestCalculationWithoutOverrides: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithoutOverrides-unlikely-calculationNumber`,
});
export const icalcTestConfigurationWithoutOverrides: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationWithoutOverrides-unlikely-matNumber`,
  state: {
    workStepOverrides: {
      consignment: undefined,
      crimp: undefined,
      sendTestReport: undefined,
    },
  },
});
export const icalcTestCalculationWithUpdatedChainflexPrice: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedChainflexPrice-unlikely-calculationNumber`,
  calculationFactor: 1,
  mat017ItemRiskFactor: 2,
  mat017ItemAndWorkStepRiskFactor: 2,
});

export const icalcTestCalculationWithUpdatedMat017ItemPrice: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedMat017ItemPrice-unlikely-calculationNumber`,
  calculationFactor: 1,
  mat017ItemRiskFactor: 2,
  mat017ItemAndWorkStepRiskFactor: 2,
});

export const icalcTestConfigurationWithUpdatedMat017ItemPrice: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedMat017ItemPrice-unlikely-matNumber`,
  state: {
    connectorState: {
      leftConnector: {
        mat017ItemListWithWidenData: [
          {
            ...icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0],
            overrides: {
              amountDividedByPriceUnit: 0.9,
            },
          },
        ],
      },
    },
  },
});

export const icalcTestConfigurationWithUpdatedChainflexPrice: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedChainflexPrice-unlikely-matNumber`,
  state: {
    chainFlexState: {
      chainflexCable: {
        price: {
          germanListPrice: 0.1,
        },
      },
    },
    workStepOverrides: {
      consignment: 1,
      crimp: 0,
      sendTestReport: 1,
      projektierung: 1,
      auftragsmanagement: 1,
      einkaufDispo: 1,
    },
  },
  partNumber: 'CF10.01.12',
});
export const icalcTestCalculationWithUpdatedChainflexPriceWithManyAssignments: Partial<Calculation> =
  createPartialCalculation({
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedChainflexPriceWithManyAssignments-unlikely-calculationNumber`,
  });

export const icalcTestCalculationWithUpdatedMat017ItemPriceWithManyAssignments: Partial<Calculation> =
  createPartialCalculation({
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedMat017ItemPriceWithManyAssignments-unlikely-calculationNumber`,
  });

export const icalcTestConfigurationWithUpdatedMat017ItemPriceWithManyAssignments: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedMat017ItemPriceWithManyAssignments-unlikely-matNumber`,
    state: {
      connectorState: {
        leftConnector: {
          mat017ItemListWithWidenData: [
            {
              ...icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0],
              overrides: {
                amountDividedByPriceUnit: 0.9,
              },
            },
          ],
        },
      },
    },
  });

export const icalcTestConfigurationWithUpdatedChainflexPriceWithManyAssignments: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedChainflexPriceWithManyAssignments-unlikely-matNumber`,
    state: {
      chainFlexState: {
        chainflexCable: {
          price: {
            germanListPrice: 0.1,
          },
        },
      },
    },
    partNumber: 'CF10.01.12',
  });
export const icalcTestConfigurationWithNotUpdatedChainflexPriceWithManyAssignments: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithNotUpdatedChainflexPriceWithManyAssignments-unlikely-matNumber`,
  });
export const icalcTestConfigurationWithNotUpdatedMat017ItemPriceWithManyAssignments: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithNotUpdatedMat017ItemPriceWithManyAssignments-unlikely-matNumber`,
  });
export const icalcTestCalculationWithRemovedMat017Item: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithRemovedMat017Item-unlikely-calculationNumber`,
});
export const icalcTestConfigurationWithRemovedMat017Item: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithRemovedMat017Item-unlikely-matNumber`,
  state: {
    connectorState: {
      leftConnector: {
        mat017ItemListWithWidenData: [
          {
            ...icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0],
            matNumber: 'e2e-dynamic-mat-RemovedMAT0171Test',
            itemStatus: Mat017ItemStatus.removed,
            overrides: {
              ...icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[1].overrides,
              mat017ItemGroup: undefined,
            },
          },
          {
            ...icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[1],
            matNumber: 'e2e-dynamic-mat-RemovedMAT01712Test',
            itemStatus: Mat017ItemStatus.inactive,
          },
        ],
      },
    },
  },
});
export const icalcTestCalculationWithRemovedChainflex: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithRemovedChainflex-unlikely-calculationNumber`,
});
export const icalcTestConfigurationWithRemovedChainflex: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithRemovedChainflex-unlikely-matNumber`,
  state: {
    chainFlexState: {
      chainflexCable: {
        partNumber: 'REMOVED',
        price: {
          germanListPrice: 11,
        },
      },
    },
  },
  partNumber: 'REMOVED',
});
export const icalcTestCalculationWithRemovedChainflexWithManyAssignments: Partial<Calculation> =
  createPartialCalculation({
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithRemovedChainflexWithManyAssignments-unlikely-calculationNumber`,
  });
export const icalcTestCalculationWithRemovedMat017ItemWithManyAssignments: Partial<Calculation> =
  createPartialCalculation({
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithRemovedMat017ItemWithManyAssignments-unlikely-calculationNumber`,
  });
export const icalcTestConfigurationWithRemovedMat017ItemWithManyAssignments: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithRemovedMat017ItemWithManyAssignments-unlikely-matNumber`,
    state: {
      connectorState: {
        leftConnector: {
          mat017ItemListWithWidenData: [
            {
              ...icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0],
              matNumber: 'e2e-dynamic-mat-RemovedMAT0171Test',
              itemStatus: Mat017ItemStatus.removed,
              overrides: {
                ...icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].overrides,
                mat017ItemGroup: undefined,
              },
            },
            {
              ...icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[1],
              matNumber: 'e2e-dynamic-mat-RemovedMAT01712Test',
              itemStatus: Mat017ItemStatus.inactive,
            },
          ],
        },
      },
    },
  });
export const icalcTestConfigurationWithRemovedChainflexWithManyAssignments: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithRemovedChainflexWithManyAssignments-unlikely-matNumber`,
    state: {
      chainFlexState: {
        chainflexCable: {
          partNumber: 'REMOVED',
          price: {
            germanListPrice: 11,
          },
        },
      },
    },
    partNumber: 'REMOVED',
  });
export const icalcTestConfigurationWithNotRemovedChainflexWithManyAssignments: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithNotRemovedChainflexWithManyAssignments-unlikely-matNumber`,
  });
export const icalcTestConfigurationWithNotRemovedMat017ItemWithManyAssignments: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestCalculationWithNotRemovedMat017ItemWithManyAssignments-unlikely-matNumber`,
  });
export const icalcIncompleteTestCalculationWithManyAssignments: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestCalculationWithManyAssignments-unlikely-calculationNumber`,
});
export const icalcCompleteTestConfigurationWithManyAssignments: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcCompleteTestConfigurationWithManyAssignments-unlikely-matNumber`,
});
export const icalcIncompleteTestConfigurationWithManyAssignments: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcIncompleteTestConfigurationWithManyAssignments-unlikely-matNumber`,
  state: {
    pinAssignmentState: {
      actionModels: undefined,
    },
  },
});
export const icalcTestCalculationWithMat017PinAssignment: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithMat017PinAssignment-unlikely-calculationNumber`,
});
export const icalcTestConfigurationWithMat017PinAssignment: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationWithMat017PinAssignment-unlikely-matNumber`,
  state: {
    pinAssignmentState: {
      actionModels: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '0': {
          left: {
            mat017Item: icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[1].matNumber,
            actionSelect: 'mat017Item',
          },
          right: { actionSelect: 'none' },
          type: 'core',
        },
      },
    },
    connectorState: icalcTestConnectorState,
  },
});

export const icalcTestCalculationWithUpdatedMat017ItemPriceInFavorites: Partial<Calculation> = createPartialCalculation(
  {
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithUpdatedMat017ItemPriceInFavorites-unlikely-calculationNumber`,
  }
);
export const icalcTestConfigurationWithUpdatedMat017ItemPriceInFavorites: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationWithUpdatedMat017ItemPriceInFavorites-unlikely-matNumber`,
    state: createConfigurationState({
      connectorState: createIcalcTestConnectorState({
        rightConnector: {
          addedMat017Items: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            MAT0171129: 1,
          },
          mat017ItemListWithWidenData: [
            {
              id: '6e20651b-902f-4753-80ee-9ca005ba79ff',
              status: 'right',
              photoUrl: 'https://fake',
              quantity: 1,
              matNumber: 'MAT0171129',
              overrides: {
                mat017ItemGroup: 'RC-K3',
                amountDividedByPriceUnit: 0.5,
              },
            },
          ],
        },
      }),
    }),
  });

export const icalcTestExcelCalculation = {
  calculationId: icalcTestCalculation.id,
  customerType: 'test localized customer type',
  customerTypeEnum: icalcTestCalculation.customerType,
  singleCableCalculationIds: [icalcTestSingleCableCalculation.id],
  processResults: [
    {
      configurationReference: {},
      workSteps: [],
    },
  ],
  locale: 'de_DE',
};

export const icalcTestCalculationWithLibraryImageAndMat017PinAssignment: Partial<Calculation> =
  createPartialCalculation({
    calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithLibraryImageAndMat017PinAssignment-unlikely-calculationNumber`,
  });
export const icalcTestConfigurationWithLibraryImageAndMat017PinAssignment: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationWithLibraryImageAndMat017PinAssignment-unlikely-matNumber`,
    state: {
      libraryState: {
        imageList: [
          {
            matNumber: icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber,
            side: 'left',
            picType: 'photo',
            height: 10,
            width: 10,
            x: 0,
            y: 0,
            src: 'https://igus.widen.net/content/0m6xfjljvm/png/RCA_PROD_MAT0172105_low_quality.png?w=1040&h=570&position=c&color=ffffff00&quality=80&u=jxmatw&cb=1708593313062',
          },
        ],
      },
      pinAssignmentState: {
        actionModels: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          '0': {
            left: {
              mat017Item: icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber,
              actionSelect: 'mat017Item',
            },
            right: { actionSelect: 'none' },
            type: 'core',
          },
        },
      },
      connectorState: {
        leftConnector: {
          mat017ItemListWithWidenData: [icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0]],
          addedMat017Items: {
            [icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber]: 1,
          },
        },
        rightConnector: {
          mat017ItemListWithWidenData: [icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0]],
          addedMat017Items: {
            [icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber]: 1,
          },
        },
      },
    },
  });

export const manuallyCreatedMat017ItemMatNumber = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-manuallyCreatedMat017ItemMatNumber`;

export const icalcTestCalculationWithManuallyCreatedItem: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithManuallyCreatedItem-unlikely-calculationNumber`,
});

export const icalcTestConfigurationWithManuallyCreatedItem: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationWithManuallyCreatedItem-unlikely-matNumber`,
  state: {
    connectorState: {
      leftConnector: {
        mat017ItemListWithWidenData: [
          createIcalcTestRedactedMat017ItemWithWidenData({
            id: undefined,
            manuallyCreated: true,
            matNumber: manuallyCreatedMat017ItemMatNumber,
          }),
        ],
        addedMat017Items: {
          [manuallyCreatedMat017ItemMatNumber]: 1,
        },
      },
    },
  },
});

export const icalcTestCalculationWithLibraryImage: Partial<Calculation> = createPartialCalculation({
  calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculationWithLibraryImage-unlikely-calculationNumber`,
});

export const icalcTestConfigurationWithLibraryImage: Partial<Configuration> = createPartialConfiguration({
  matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationWithLibraryImage-unlikely-matNumber`,
  state: {
    libraryState: {
      imageList: [
        {
          matNumber: icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber,
          side: 'left',
          picType: 'photo',
          height: 100,
          width: 100,
          x: 10,
          y: 10,
          src: 'https://igus.widen.net/content/0m6xfjljvm/png/RCA_PROD_MAT0172105_low_quality.png?w=1040&h=570&position=c&color=ffffff00&quality=80&u=jxmatw&cb=1708593313062',
        },
      ],
    },
    connectorState: {
      leftConnector: {
        mat017ItemListWithWidenData: [icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0]],
        addedMat017Items: {
          [icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber]: 1,
        },
      },
      rightConnector: {
        mat017ItemListWithWidenData: [icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0]],
        addedMat017Items: {
          [icalcTestConnectorState.leftConnector.mat017ItemListWithWidenData[0].matNumber]: 1,
        },
      },
    },
  },
});

export const icalcTestConfigurationCompleteForMultipleAssignmentToLibraryImage: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationCompleteForMultipleAssignmentToLibraryImage-unlikely-matNumber`,
  });

export const icalcTestConfigurationCompleteForMultipleAssignmentToPinAssignment: Partial<Configuration> =
  createPartialConfiguration({
    matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationCompleteForMultipleAssignmentToPinAssignment-unlikely-matNumber`,
  });
