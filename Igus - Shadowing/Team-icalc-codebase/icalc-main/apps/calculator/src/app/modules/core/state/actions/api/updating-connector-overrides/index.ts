import type { UpdateMat017ItemsOverridesInConfigurationsResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[API] UpdatingConnectorOverrides Succeeded';
  constructor(public payload: UpdateMat017ItemsOverridesInConfigurationsResponseDto) {}
}
