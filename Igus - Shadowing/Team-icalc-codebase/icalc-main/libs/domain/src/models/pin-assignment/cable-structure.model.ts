import type { FormGroup } from '@angular/forms';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import type { CoreColor } from './cf-item.model';

export type CableStructureItemList = (Core | Shield | Twisting | Litze)[];

export interface CableStructureInformation {
  isValid: boolean;
  validationErrors: string[];
  structure: CableStructureItemList;
}

export interface CableStructureItem {
  type: CableStructureItemType;
  forms?: CableStructureItemFormMap;
  isOdd?: boolean;
  lineOrder?: number;
}

export interface IcalcBridge {
  start: IcalcDot; // x - y
  end: IcalcDot; // x - y
}

export const getNumberOfSubactionsWithinShield = (item: CableStructureItem, actionModels: ActionModels): number => {
  const shield = item as Shield;

  if (!shield.lineOrder) {
    return 0;
  }

  let numOfSubActions = 0;

  const posOfFirstActionModelWithinShield = shield.lineOrder - shield.shieldedItemCount;
  const posOfLastActionModelWithinShield = shield.lineOrder - 1;

  for (let i = posOfLastActionModelWithinShield; i >= posOfFirstActionModelWithinShield; i--) {
    const actionModel = actionModels[i];

    if (!!actionModel.left.subActionSelect || !!actionModel.right.subActionSelect) {
      numOfSubActions++;
    }
  }

  return numOfSubActions;
};

export const getNumberAndOrderOfSubactionsWithinTwist = (
  item: Twisting,
  index: number,
  structure: CableStructureItemList
): { numOfSubActions: number; positions: number[] } => {
  let numOfSubActions = 0;
  const positions = [];

  for (let i = index - 1; i >= index - item.twistedCoreCount; i--) {
    const actionModel = structure[i];
    const forms = actionModel.forms;

    if (!forms) {
      continue; // skip current iteration should no forms be defined
    }

    if (actionModel) {
      if (!!forms.left?.form?.value.subActionSelect || !!forms?.right?.form?.value.subActionSelect) {
        numOfSubActions++;
        const position = item.twistedCoreCount - (index - i) + 1; // Inverse sequence

        positions.push(position);
      }
    }
  }

  return {
    numOfSubActions,
    positions,
  };
};

// inner shields are described in Icalc as SH1, SH2, ..., SHn. SH0 represents outer shield
export const isNameOfInnerShield = (name: string): boolean => {
  return name.startsWith('SH') && parseInt(name.split('SH')[1], 10) > 0;
};

export const isSameDot = (first: IcalcDot, second: IcalcDot): boolean =>
  first[0] === second[0] && first[1] === second[1];
export const isDotOnSameVerticalLevel = (first: IcalcDot, second: IcalcDot): boolean => first[0] === second[0];
export const bridgeContainsDot = (bridge: IcalcBridge, dot: IcalcDot): boolean => {
  let result = false;

  if (!bridge.end || !bridge.start) {
    return result;
  }
  if (!isDotOnSameVerticalLevel(bridge.start, dot) || !isDotOnSameVerticalLevel(bridge.end, dot)) {
    return false;
  }
  if (isSameDot(bridge.end, dot)) {
    return true;
  }
  for (let index = bridge.start[1]; index < bridge.end[1]; index++) {
    if (isSameDot([bridge.start[0], index], dot)) {
      result = false;
      break;
    }
  }
  return result;
};
export const bridgeContainsBridge = (contains: IcalcBridge, contained: IcalcBridge): boolean => {
  if (
    !isDotOnSameVerticalLevel(contains.start, contained.start) ||
    !isDotOnSameVerticalLevel(contains.end, contained.end)
  ) {
    return false;
  }
  if (isSameDot(contains.start, contained.start) && isSameDot(contains.end, contained.end)) {
    return false;
  }

  return contains.start[1] <= contained.start[1] && contains.end[1] >= contained.end[1];
};

export const removeUnusedNewLinesFromActionModels = (
  bridges: Bridges,
  actionModels: ActionModels,
  pinAssignmentStructure: CableStructureItemList
): { actionModels: ActionModels; pinAssignmentStructure: CableStructureItemList } => {
  const leftBridgesValues = new Set<number>(Object.values(bridges.left).flatMap((obj) => [...obj.start, ...obj.end]));
  const rightBridgesValues = new Set<number>(Object.values(bridges.right).flatMap((obj) => [...obj.start, ...obj.end]));
  const bothSideBridgeValues = [...leftBridgesValues, ...rightBridgesValues];

  const actionModelKeys = Object.keys(actionModels).map((key) => Number(key));
  const newActionModels: ActionModels = {};
  const lastActionModelIndex = Math.max(...actionModelKeys, -1);

  // no bridges exist so all new lines with type litze should be removed
  if (bothSideBridgeValues.length === 0) {
    for (const [key, action] of Object.entries(actionModels)) {
      const keyAsNumber = Number(key);

      if (action.type !== 'litze') {
        newActionModels[keyAsNumber] = action;
      } else {
        pinAssignmentStructure.pop();
      }
    }

    return { actionModels: newActionModels, pinAssignmentStructure };
  }

  // bridges exist so remove only new lines which are not attached to a bridge
  for (let i = 0; i <= lastActionModelIndex; i++) {
    const action = actionModels[i];
    const shouldKeepLineInActionModels = action && (action.type !== 'litze' || bothSideBridgeValues.includes(i));

    if (shouldKeepLineInActionModels) {
      if (!leftBridgesValues.has(i)) {
        action.left = { actionSelect: 'none' };
      }
      if (!rightBridgesValues.has(i)) {
        action.right = { actionSelect: 'none' };
      }
      newActionModels[i] = action;
    } else {
      pinAssignmentStructure.splice(i, 1);
    }
  }

  return { actionModels: newActionModels, pinAssignmentStructure };
};

export type IcalcDot = [number, number];
export type Bridges = { left: IcalcBridge[]; right: IcalcBridge[] };

export interface Core extends CableStructureItem {
  color: CoreColor;
  thickness: number;
}

export interface Shield extends CableStructureItem {
  description: string;
  shieldedItemCount: number;
  horizontalOrder: number;
}

export interface Twisting extends CableStructureItem {
  twistedCoreCount: number;
  horizontalOrder: number;
}

export interface Litze extends CableStructureItem {
  leftLabel: string;
  rightLabel: string;
}

export type CableStructureItemType = 'core' | 'shield' | 'twisting' | 'litze';

export interface CableStructureForm {
  form?: FormGroup;
  options?: FormlyFormOptions;
  fields?: FormlyFieldConfig[];
}

export interface CableStructureItemFormMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  left: { form?: FormGroup; options?: FormlyFormOptions; fields?: FormlyFieldConfig[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  right: { form?: FormGroup; options?: FormlyFormOptions; fields?: FormlyFieldConfig[] };
}

// TODO might be useful for refactoring of chainflex component (requirement to add cabelType)
/**
 * Akeneo attribute: attr_cable_type_plural_simple_select
 * "harnessed" (konfektionierte) cable types (val_cable_type_07 - 17 & 31) are not relevant for icalc (although provided by Akeneo)
 */
export type CableType =
  | 'busCable' // Busleitung / val_cable_type_01
  | 'busCableRail' // Busleitung für Schienenfahrzeuge / val_cable_type_02
  | 'dataCable' // Datenleitung / val_cable_type_03
  | 'hybridServoCable' // Hybrid-Servoleitung / val_cable_type_04
  | 'hybridCable' // Hybridleitung / val_cable_type_05
  | 'coaxCable' // Koaxleitung / val_cable_type_06
  | 'fibreOpticCable' // Lichtwellenleiter / val_cable_type_18
  | 'measuringSystemCable' // Mess-Systemleitungen / val_cable_type_19
  | 'mediumVoltageCable' // Mittelspannungsleitungen / val_cable_type_20
  | 'motorCable' // Motorleitungen / val_cable_type_21
  | 'pneumaticHoses' // Pneumatikschläuche / val_cable_type_22
  | 'sensorActuatorDistributionBox' // Sensor-/Aktor-Verteiler / val_cable_type_23
  | 'servoCable' // Servoleitungen / val_cable_type_24
  | 'specialCable' // Spezialleitungen / val_cable_type_25
  | 'spindleCableSingleCore' // Spindelleitungen/Einzeladern / val_cable_type_26
  | 'controlCable' // Steuerleitungen / val_cable_type_27
  | 'controlCableForRailVehicles' // Steuerleitungen für Schienenfahrzeuge / val_cable_type_28
  | 'thermocoupleCable' // Thermo-Ausgleichsleitungen / val_cable_type_29
  | 'twistableCable'; // Torsionsleitungen / val_cable_type_30

export type ActionSelectType =
  | 'none'
  | 'cutOff'
  | 'cutOffAndSkin'
  | 'skin'
  | 'isolate'
  | 'setOnContact'
  | 'mat017Item'
  | 'placeOnJacket'
  | 'rollUp';

type CutOffSubActionsType = 'insulate' | 'noInsulate';
type SkinSubActionsType = 'none' | 'twist' | 'tin';
type RollUpSubActionsType = 'withCopperBand' | 'withHeatShrinkWithoutGlue' | 'fixWithInsulatingTape' | 'noFix';
type ScreenWindowSubActionsType = 'withHeatShrink' | 'withoutHeatShrink';

export type SubActionSelectType =
  | CutOffSubActionsType
  | SkinSubActionsType
  | RollUpSubActionsType
  | ScreenWindowSubActionsType;

export interface ActionSelection {
  actionSelect: ActionSelectType;
  subActionSelect?: SubActionSelectType;
  skinLengthInput?: number;
  rollUpInput?: number;
  pinDescriptionInput?: string;
  mat017Item?: string;
}

export interface ActionModels {
  [key: string]: ActionSelectionContainer;
}

export interface ActionSelectionContainer {
  type: CableStructureItemType;
  left: ActionSelection;
  right: ActionSelection;
}
