import type { SaveSingleCableCalculationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] UpdatingRightConnector Succeeded';
  constructor(public payload: SaveSingleCableCalculationResponseDto) {}
}
