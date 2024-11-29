import type { UpdateMat017ItemsOverridesInConfigurationsResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] UpdatingMat017ItemPrices Succeeded';
  constructor(public payload: UpdateMat017ItemsOverridesInConfigurationsResponseDto) {}
}
