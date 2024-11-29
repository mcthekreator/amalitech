import type { OneSideOfConfigurationConnectorPresentation } from '@igus/icalc-domain';

export class Started {
  public static readonly type = '[RightConnector] LeavingRightConnectorPage Started';
  constructor(public payload: { rightConnector: OneSideOfConfigurationConnectorPresentation }) {}
}
