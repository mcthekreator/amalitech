import type { OneSideOfConfigurationConnectorPresentation } from '@igus/icalc-domain';

export class Cloned {
  public static readonly type = '[LeftConnector] CloningMat017ItemList Cloned';
  constructor(public payload: { which: 'leftConnector'; data: OneSideOfConfigurationConnectorPresentation }) {}
}
