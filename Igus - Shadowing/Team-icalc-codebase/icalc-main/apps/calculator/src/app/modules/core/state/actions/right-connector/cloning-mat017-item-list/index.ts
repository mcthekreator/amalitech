import type { OneSideOfConfigurationConnectorPresentation } from '@igus/icalc-domain';

export class Cloned {
  public static readonly type = '[RightConnector] CloningMat017ItemList Cloned';
  constructor(public payload: { which: 'rightConnector'; data: OneSideOfConfigurationConnectorPresentation }) {}
}
