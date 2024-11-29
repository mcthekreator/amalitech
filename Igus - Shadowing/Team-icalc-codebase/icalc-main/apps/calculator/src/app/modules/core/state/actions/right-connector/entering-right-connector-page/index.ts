import type { IcalcConnector } from '../../../connector-state/connector-state.model';

export class Started {
  public static readonly type = '[RightConnector] EnteringRightConnectorPage Started';
}

export class Entered {
  public static readonly type = '[RightConnector] EnteringRightConnectorPage Entered';
  constructor(public payload: { rightConnector: Partial<IcalcConnector> | null }) {}
}
