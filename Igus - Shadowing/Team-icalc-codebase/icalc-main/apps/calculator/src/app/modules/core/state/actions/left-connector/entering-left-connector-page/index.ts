import type { IcalcConnector } from '../../../connector-state/connector-state.model';

export class Started {
  public static readonly type = '[LeftConnector] EnteringLeftConnectorPage Started';
}

export class Entered {
  public static readonly type = '[LeftConnector] EnteringLeftConnectorPage Entered';
  constructor(public payload: { leftConnector: Partial<IcalcConnector> | null }) {}
}
