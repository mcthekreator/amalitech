import type { OneSideOfConfigurationConnectorPresentation } from '@igus/icalc-domain';

export class Started {
  public static readonly type = '[LeftConnector] LeavingLeftConnectorPage Started';
  constructor(public payload: { leftConnector: OneSideOfConfigurationConnectorPresentation }) {}
}
