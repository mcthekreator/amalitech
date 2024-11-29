import { getWorkStepDefaultPrices } from '../result/calculation.prices';
import type { CombinedWorkStepSetNames, WorkStepPricesValuesByWorkStepSet } from '../result/work-step.model';
import {
  WorkStepSet,
  defaultDriveCliqWorkStepNames,
  defaultEthernetWorkStepNames,
  defaultMachineLineWorkStepNames,
  defaultStandardWorkStepNames,
  isWorkStepSet,
} from '../result/work-step.model';
import type { ConfigurationChainFlexState } from './configuration.model';

export class WorkStepPricesValueObject {
  private readonly requiredSteps: { [key in WorkStepSet]: ReadonlyArray<CombinedWorkStepSetNames> } = {
    [WorkStepSet.standard]: defaultStandardWorkStepNames,
    [WorkStepSet.driveCliq]: defaultDriveCliqWorkStepNames,
    [WorkStepSet.machineLine]: defaultMachineLineWorkStepNames,
    [WorkStepSet.ethernet]: defaultEthernetWorkStepNames,
  };

  private workStepSet: WorkStepSet;
  private valid: boolean;
  private value: WorkStepPricesValuesByWorkStepSet;
  private error: Error | null = null;

  private constructor(workStepPrices: WorkStepPricesValuesByWorkStepSet, workStepSet: WorkStepSet) {
    if (!workStepPrices || typeof workStepPrices !== 'object') {
      this.error = new Error('workStepPrices object is required.');
      return;
    }

    if (!workStepSet || !isWorkStepSet(workStepSet)) {
      this.error = new Error('workStepSet is required.');
      return;
    }

    this.workStepSet = workStepSet;

    this.validate(workStepPrices);

    if (!this.valid) {
      this.error = new Error('workStepPrices are not valid.');
      return;
    }

    this.value = { ...workStepPrices };
  }

  public static create(
    workStepSet: WorkStepSet,
    chainFlexState: ConfigurationChainFlexState,
    workStepPrices?: WorkStepPricesValuesByWorkStepSet
  ): WorkStepPricesValueObject {
    return new WorkStepPricesValueObject(
      workStepPrices || getWorkStepDefaultPrices(workStepSet, chainFlexState),
      workStepSet
    );
  }

  public getValue(): { value: WorkStepPricesValuesByWorkStepSet; error: Error | null } {
    return { value: { ...this.value }, error: this.error };
  }

  private validate(input: WorkStepPricesValuesByWorkStepSet): void {
    const keys = Object.keys(input);

    this.valid = true;

    for (const requiredKey of this.requiredSteps[this.workStepSet]) {
      if (!keys.includes(requiredKey)) {
        this.valid = false;
        break;
      }

      const currentStep = input[requiredKey as keyof WorkStepPricesValuesByWorkStepSet];

      if (!currentStep.serialCustomer || !currentStep.betriebsMittler) {
        this.valid = false;
        break;
      }
    }
  }
}
