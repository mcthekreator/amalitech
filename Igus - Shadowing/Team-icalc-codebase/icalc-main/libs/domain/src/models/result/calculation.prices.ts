import type { ChainflexCable } from '../chainflex';
import type { ConfigurationChainFlexState, WorkStepPrices } from '../configuration';
import type { Shield } from '../pin-assignment';
import { isNameOfInnerShield } from '../pin-assignment';
import type {
  CommercialWorkStepNames,
  DriveCliqWorkStepNames,
  EthernetWorkStepNames,
  MachineLineWorkStepNames,
  StandardWorkStepNames,
} from './work-step.model';
import { WorkStepSet } from './work-step.model';

const COMMERCIAL_WORK_STEP_PRICES: WorkStepPrices<CommercialWorkStepNames> = {
  projektierung: {
    serialCustomer: 5.63,
    betriebsMittler: 5.63,
  },
  auftragsmanagement: {
    serialCustomer: 3.38,
    betriebsMittler: 3.38,
  },
  einkaufDispo: {
    serialCustomer: 2.25,
    betriebsMittler: 2.25,
  },
  transportStock: {
    serialCustomer: 2.25,
    betriebsMittler: 2.25,
  },
};

const WORK_STEP_PRICES_STANDARD: WorkStepPrices<StandardWorkStepNames> = {
  ...COMMERCIAL_WORK_STEP_PRICES,
  consignment: {
    serialCustomer: 0.08,
    betriebsMittler: 0.11,
  },
  strip: {
    serialCustomer: 1.91,
    betriebsMittler: 2.81,
  },
  shieldHandling: {
    serialCustomer: 1.35,
    betriebsMittler: 3.38,
  },
  skinning: {
    serialCustomer: 0.2,
    betriebsMittler: 0.28,
  },
  crimp: {
    serialCustomer: 0.32,
    betriebsMittler: 0.56,
  },
  labeling: {
    serialCustomer: 0.68,
    betriebsMittler: 2.25,
  },
  drillingSealInsert: {
    serialCustomer: 45,
    betriebsMittler: 45,
  },
  test: {
    serialCustomer: 4.28,
    betriebsMittler: 5.63,
  },
  sendTestReport: {
    serialCustomer: 1.13,
    betriebsMittler: 1.13,
  },
  cutUnder20MM: {
    serialCustomer: 1.69,
    betriebsMittler: 1.69,
  },
  cutOver20MM: {
    serialCustomer: 2.25,
    betriebsMittler: 2.25,
  },
  testFieldPrep: {
    serialCustomer: 1.69,
    betriebsMittler: 1.69,
  },
  package: {
    serialCustomer: 1.13,
    betriebsMittler: 1.13,
  },
};

const WORK_STEP_PRICES_DRIVECLIQ: WorkStepPrices<DriveCliqWorkStepNames> = {
  ...COMMERCIAL_WORK_STEP_PRICES,
  assembly: {
    serialCustomer: 2.88,
    betriebsMittler: 2.88,
  },
  consignment: {
    serialCustomer: 0.08,
    betriebsMittler: 0.11,
  },
  stripShieldHandling: {
    serialCustomer: 2.16,
    betriebsMittler: 2.16,
  },
  labeling: {
    serialCustomer: 0.68,
    betriebsMittler: 2.25,
  },
  drillingSealInsert: {
    serialCustomer: 45,
    betriebsMittler: 45,
  },
  test: {
    serialCustomer: 4.28,
    betriebsMittler: 5.63,
  },
  sendTestReport: {
    serialCustomer: 1.13,
    betriebsMittler: 1.13,
  },
  cutUnder20MM: {
    serialCustomer: 1.69,
    betriebsMittler: 1.69,
  },
  cutOver20MM: {
    serialCustomer: 2.25,
    betriebsMittler: 2.25,
  },
  testFieldPrep: {
    serialCustomer: 1.69,
    betriebsMittler: 1.69,
  },
  package: {
    serialCustomer: 1.13,
    betriebsMittler: 1.13,
  },
};

const WORK_STEP_PRICES_ETHERNET: WorkStepPrices<EthernetWorkStepNames> = {
  ...COMMERCIAL_WORK_STEP_PRICES,
  assembly: {
    serialCustomer: 4.05,
    betriebsMittler: 4.05,
  },
  consignment: {
    serialCustomer: 0.08,
    betriebsMittler: 0.11,
  },
  stripShieldHandling: {
    serialCustomer: 2.16,
    betriebsMittler: 2.16,
  },
  labeling: {
    serialCustomer: 0.68,
    betriebsMittler: 2.25,
  },
  drillingSealInsert: {
    serialCustomer: 45,
    betriebsMittler: 45,
  },
  test: {
    serialCustomer: 4.28,
    betriebsMittler: 5.63,
  },
  sendTestReport: {
    serialCustomer: 1.13,
    betriebsMittler: 1.13,
  },
  cutUnder20MM: {
    serialCustomer: 1.69,
    betriebsMittler: 1.69,
  },
  cutOver20MM: {
    serialCustomer: 2.25,
    betriebsMittler: 2.25,
  },
  testFieldPrep: {
    serialCustomer: 1.69,
    betriebsMittler: 1.69,
  },
  package: {
    serialCustomer: 1.13,
    betriebsMittler: 1.13,
  },
};

const WORK_STEP_PRICES_MACHINE_LINE: WorkStepPrices<MachineLineWorkStepNames> = {
  ...COMMERCIAL_WORK_STEP_PRICES,
  consignment: {
    serialCustomer: 0.08,
    betriebsMittler: 0.11,
  },
  stripInnerJacket: {
    serialCustomer: 0.56,
    betriebsMittler: 2.81,
  },
  stripOuterJacket: {
    serialCustomer: 1.91,
    betriebsMittler: 2.81,
  },
  shieldHandlingOuterShield: {
    serialCustomer: 1.35,
    betriebsMittler: 3.38,
  },
  shieldHandlingInnerShield: {
    serialCustomer: 0.56,
    betriebsMittler: 3.38,
  },
  skinning: {
    serialCustomer: 0.11,
    betriebsMittler: 0.28,
  },
  crimp: {
    serialCustomer: 0.19,
    betriebsMittler: 0.56,
  },
  labeling: {
    serialCustomer: 0.68,
    betriebsMittler: 2.25,
  },
  drillingSealInsert: {
    serialCustomer: 45,
    betriebsMittler: 45,
  },
  test: {
    serialCustomer: 2.25,
    betriebsMittler: 2.25,
  },
  sendTestReport: {
    serialCustomer: 1.13,
    betriebsMittler: 1.13,
  },
  cutUnder20MM: {
    serialCustomer: 1.13,
    betriebsMittler: 2.25,
  },
  cutOver20MM: {
    serialCustomer: 1.69,
    betriebsMittler: 3.38,
  },
  testFieldPrep: {
    serialCustomer: 1.69,
    betriebsMittler: 1.69,
  },
  package: {
    serialCustomer: 0.37,
    betriebsMittler: 2.25,
  },
};

const adjustStripShieldHandlingPriceIfHasInnerShields = (
  chainflexCable: ChainflexCable
): WorkStepPrices<EthernetWorkStepNames> => {
  const innerShields = chainflexCable.cableStructureInformation.structure.filter(
    (value) => value.type === 'shield' && isNameOfInnerShield((value as Shield).description)
  );
  const stripShieldHandlingPrice = innerShields.length > 0 ? 9.45 : 2.16;

  return {
    ...WORK_STEP_PRICES_ETHERNET,
    stripShieldHandling: {
      serialCustomer: stripShieldHandlingPrice,
      betriebsMittler: stripShieldHandlingPrice,
    },
  };
};

/**
 * Retrieves the default prices of Work Steps for given WorkStepSet.
 * If chainFlexState is provided, it influences for Ethernet work steps
 * the price for stripShieldHandling.
 *
 * @param workStepSet - The WorkStepSet of current configuration
 * @param [chainFlexState] - (Optional) The ChainFlexState object. Presence of an inner shield in the cable
 *                                            affects the stripShieldHandling price.
 * @returns An object containing the default prices for all WorkSteps within given WorkStepSet.
 */
export const getWorkStepDefaultPrices = (
  workStepSet: WorkStepSet,
  chainFlexState?: ConfigurationChainFlexState
):
  | WorkStepPrices<StandardWorkStepNames>
  | WorkStepPrices<DriveCliqWorkStepNames>
  | WorkStepPrices<MachineLineWorkStepNames>
  | WorkStepPrices<EthernetWorkStepNames> => {
  switch (workStepSet) {
    case WorkStepSet.standard:
      return WORK_STEP_PRICES_STANDARD;
    case WorkStepSet.driveCliq:
      return WORK_STEP_PRICES_DRIVECLIQ;
    case WorkStepSet.machineLine:
      return WORK_STEP_PRICES_MACHINE_LINE;
    case WorkStepSet.ethernet:
      if (!chainFlexState?.chainflexCable) {
        return WORK_STEP_PRICES_ETHERNET;
      }

      return adjustStripShieldHandlingPriceIfHasInnerShields(chainFlexState.chainflexCable);
    default:
      return WORK_STEP_PRICES_STANDARD;
  }
};
