import type {
  Litze,
  ActionModels,
  IcalcBridge,
  IcalcHTTPError,
  CableStructureItemList,
  CableStructureInformation,
  ChainflexCable,
  ConfigurationPinAssignmentState,
} from '@igus/icalc-domain';

export interface EnteringPinAssignmentPagePayload {
  chainflexCable: ChainflexCable;
  cableStructureInformation: CableStructureInformation;
  pinAssignmentState: ConfigurationPinAssignmentState;
}

export interface PinAssignmentStateModel {
  base64Image: string;
  chainFlexNumber: string;
  pinAssignmentStructure: CableStructureItemList;
  actionModels: ActionModels;
  lineOrder?: number;
  bridges: { left: IcalcBridge[]; right: IcalcBridge[] };
  litze: Litze[];
  processServerError: IcalcHTTPError;
}

export interface LeavingPinAssignmentPageStartedPayload {
  pinAssignmentState: ConfigurationPinAssignmentState;
  hasSavedLatestChanges: boolean;
}

export interface NavigatingBackFromPinAssignmentPagePayload {
  pinAssignmentState: ConfigurationPinAssignmentState;
  hasSavedLatestChanges: boolean;
}

export interface NavigatingToResultsPagePayload {
  pinAssignmentState: ConfigurationPinAssignmentState;
  approve?: boolean;
}

export interface ApprovingConfigurationStartedPayload {
  calculationId: string;
  configurationId: string;
}
