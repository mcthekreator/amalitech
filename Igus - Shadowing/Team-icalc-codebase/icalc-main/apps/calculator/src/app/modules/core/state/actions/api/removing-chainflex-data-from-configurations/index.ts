import type { RemoveChainflexDataResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] RemovingChainflexDataFromConfigurations Succeeded';
  constructor(public payload: RemoveChainflexDataResponseDto) {}
}
