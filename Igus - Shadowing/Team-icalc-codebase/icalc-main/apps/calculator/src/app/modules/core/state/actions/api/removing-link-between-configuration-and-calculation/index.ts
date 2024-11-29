import type { RemoveLinkBetweenConfigurationAndCalculationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] RemovingLinkBetweenConfigurationAndCalculation Succeeded';
  constructor(public payload: RemoveLinkBetweenConfigurationAndCalculationResponseDto) {}
}
