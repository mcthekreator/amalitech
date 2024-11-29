import type {
  ActionSelectType,
  ActionSelection,
  CableStructureItemType,
  ConfigurationState,
  IcalcBridge,
  Shield,
} from '@igus/icalc-domain';
import { ArrayUtils, WorkStepName, WorkStepSet, isNameOfInnerShield } from '@igus/icalc-domain';
import { BaseWorkStepQuantitiesBuilder } from './base-work-step-quantities-builder';

export class PinAssignmentQuantities extends BaseWorkStepQuantitiesBuilder {
  private actionItems: {
    type: CableStructureItemType;
    left: ActionSelection;
    right: ActionSelection;
  }[] = [];

  private shieldsFromCableStructure: Shield[];

  private leftActionCount: number;
  private leftCoreActionCount: number;

  private rightActionCount: number;
  private rightCoreActionCount: number;

  private shieldActionsCount: number;
  private coreAndLitzeActionsCount: number;
  private bridgeCount: number;
  private coreAndLitzeMat017ItemActionsCount: number;

  private hasSetNoActions: boolean;
  private hasSetActionsOnOneSide: boolean;
  private hasSetActionsOnBothSides: boolean;

  constructor(private configurationState: ConfigurationState) {
    super();

    this.setActionItems();
    this.setShieldsFromCableStructure();
    this.countLeftActionItems();
    this.countRightActionItems();
    this.countShieldActions();
    this.countCoreAndLitzeActions();
    this.countBridge();
    this.countCoreAndLitzeMat017ItemActions();
    this.checkOnWhichSidesActionsExist();
  }

  public setStrip(): void {
    this.setQuantityDependentOnSide(WorkStepName.strip, {
      quantityForNoActionsSet: 0,
      quantityForOneSideSet: 1,
      quantityForBothSidesSet: 2,
    });
  }

  public setAssembly(): void {
    this.setQuantityDependentOnSide(WorkStepName.assembly, {
      quantityForNoActionsSet: 0,
      quantityForOneSideSet: 1,
      quantityForBothSidesSet: 2,
    });
  }

  public setStripShieldHandling(): void {
    this.setQuantityDependentOnSide(WorkStepName.stripShieldHandling, {
      quantityForNoActionsSet: 0,
      quantityForOneSideSet: 1,
      quantityForBothSidesSet: 2,
    });
  }

  public setShieldHandling(): void {
    this.output[WorkStepName.shieldHandling] = this.shieldActionsCount;
  }

  public setStripInnerJacket(): void | undefined {
    const hasInnerJacket = this.configurationState.chainFlexState?.chainflexCable.innerJacket?.de_DE !== 'no data';

    if (!hasInnerJacket) {
      this.output[WorkStepName.stripInnerJacket] = 0;
      return;
    }

    this.setQuantityDependentOnSide(WorkStepName.stripInnerJacket, {
      quantityForNoActionsSet: 0,
      quantityForOneSideSet: 1,
      quantityForBothSidesSet: 2,
    });
  }

  public setStripOuterJacket(): void {
    this.setQuantityDependentOnSide(WorkStepName.stripOuterJacket, {
      quantityForNoActionsSet: 0,
      quantityForOneSideSet: 1,
      quantityForBothSidesSet: 2,
    });
  }

  public setShieldHandlingOuterShield(): void | undefined {
    if (this.configurationState.workStepSet !== WorkStepSet.machineLine) {
      this.output[WorkStepName.shieldHandlingOuterShield] = 0;
      return;
    }

    const left = this.actionItems
      .filter((item) => item?.left)
      .filter((item) => item.type === 'shield')
      .find((_, index) => this.isOuterShieldByIndex(index))?.left;

    const right = this.actionItems
      .filter((item) => item?.right)
      .filter((item) => item.type === 'shield')
      .find((_, index) => this.isOuterShieldByIndex(index))?.right;

    const actionSelectItems = [];

    if (left) {
      actionSelectItems.push(left.actionSelect);
    }

    if (right) {
      actionSelectItems.push(right.actionSelect);
    }

    this.output[WorkStepName.shieldHandlingOuterShield] = actionSelectItems.filter(
      (action) => action !== 'none'
    ).length;
  }

  public setShieldHandlingInnerShield(): void | undefined {
    if (this.configurationState.workStepSet !== WorkStepSet.machineLine) {
      this.output[WorkStepName.shieldHandlingOuterShield] = 0;
      return;
    }

    const actionsOfInnerShields: ActionSelectType[] = this.actionItems
      .filter((item) => item.type === 'shield')
      .filter((_, index) => this.isInnerShieldByIndex(index))
      .flatMap((shield) => [shield.left.actionSelect, shield.right.actionSelect])
      .filter((action) => action !== 'none');

    this.output[WorkStepName.shieldHandlingInnerShield] = actionsOfInnerShields.length;
  }

  public setSkinning(): void {
    this.output[WorkStepName.skinning] = this.coreAndLitzeActionsCount + 2 * this.bridgeCount;
  }

  public setCrimp(): void {
    this.output[WorkStepName.crimp] = this.coreAndLitzeMat017ItemActionsCount;
  }

  public setTest(): void {
    this.output[WorkStepName.test] = this.leftCoreActionCount + this.rightCoreActionCount > 0 ? 1 : 0;
  }

  private setQuantityDependentOnSide(
    workStep: WorkStepName,
    values: { quantityForNoActionsSet: number; quantityForOneSideSet: number; quantityForBothSidesSet: number }
  ): void {
    if (this.hasSetNoActions) {
      this.output[workStep] = values.quantityForNoActionsSet;
    } else if (this.hasSetActionsOnOneSide) {
      this.output[workStep] = values.quantityForOneSideSet;
    } else if (this.hasSetActionsOnBothSides) {
      this.output[workStep] = values.quantityForBothSidesSet;
    }
  }

  private setActionItems(): void {
    this.actionItems = ArrayUtils.fallBackToEmptyArray<{
      type: CableStructureItemType;
      left: ActionSelection;
      right: ActionSelection;
    }>(Object.values(this.configurationState.pinAssignmentState?.actionModels));
  }

  /*
   * Shields in cableStructureInformation contain the description SH0, SH1 etc. which is needed to compute
   * shields handling.
   */
  private setShieldsFromCableStructure(): void {
    const cableStructure = ArrayUtils.fallBackToEmptyArray(
      this.configurationState.chainFlexState.chainflexCable.cableStructureInformation?.structure
    );
    const shieldsFromCableStructure = cableStructure.filter((item) => item.type === 'shield');

    this.shieldsFromCableStructure = [...shieldsFromCableStructure] as Shield[];
  }

  private countLeftActionItems(): void {
    // total amount of actions left
    this.leftActionCount = this.actionItems.filter((item) => item.left?.actionSelect !== 'none').length;
    this.leftCoreActionCount = this.actionItems.filter(
      (item) => item.left?.actionSelect !== 'none' && item.type === 'core'
    ).length;
  }

  private countRightActionItems(): void {
    // total amount of actions left
    this.rightActionCount = this.actionItems.filter((item) => item.right?.actionSelect !== 'none').length;
    this.rightCoreActionCount = this.actionItems.filter(
      (item) => item.right?.actionSelect !== 'none' && item.type === 'core'
    ).length;
  }

  private countShieldActions(): void {
    // amount of shield actions
    this.shieldActionsCount =
      this.actionItems.filter((item) => item.left?.actionSelect !== 'none' && item.type === 'shield').length +
      this.actionItems.filter((item) => item.right?.actionSelect !== 'none' && item.type === 'shield').length;
  }

  private countCoreAndLitzeActions(): void {
    // amount of core & litze actions (can be combined, we only need the sum)
    this.coreAndLitzeActionsCount =
      this.actionItems.filter(
        (item) => item.left?.actionSelect !== 'none' && (item.type === 'core' || item.type === 'litze')
      ).length +
      this.actionItems.filter(
        (item) => item.right?.actionSelect !== 'none' && (item.type === 'core' || item.type === 'litze')
      ).length;
  }

  private countBridge(): void {
    this.bridgeCount =
      ArrayUtils.fallBackToEmptyArray<IcalcBridge>(this.configurationState?.pinAssignmentState?.bridges?.left).length +
      ArrayUtils.fallBackToEmptyArray<IcalcBridge>(this.configurationState?.pinAssignmentState?.bridges?.right).length;
  }

  private countCoreAndLitzeMat017ItemActions(): void {
    this.coreAndLitzeMat017ItemActionsCount =
      this.actionItems.filter(
        (item) =>
          (item.type === 'core' || item.type === 'litze') &&
          (item.left.actionSelect === 'mat017Item' || item.left.actionSelect === 'setOnContact')
      ).length +
      this.actionItems.filter(
        (item) =>
          (item.type === 'core' || item.type === 'litze') &&
          (item.right.actionSelect === 'mat017Item' || item.right.actionSelect === 'setOnContact')
      ).length;
  }

  private checkOnWhichSidesActionsExist(): void {
    this.hasSetNoActions = this.leftActionCount + this.rightActionCount === 0;
    this.hasSetActionsOnOneSide =
      (this.leftActionCount > 0 && this.rightActionCount === 0) ||
      (this.rightActionCount > 0 && this.leftActionCount === 0);
    this.hasSetActionsOnBothSides = this.leftActionCount > 0 && this.rightActionCount > 0;
  }

  private isInnerShieldByIndex(index: number): boolean {
    return isNameOfInnerShield(this.shieldsFromCableStructure[index].description);
  }

  private isOuterShieldByIndex(index: number): boolean {
    return this.shieldsFromCableStructure[index].description === 'SH0';
  }
}
