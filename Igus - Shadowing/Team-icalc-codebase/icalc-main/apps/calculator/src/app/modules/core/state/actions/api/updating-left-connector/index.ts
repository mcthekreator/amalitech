import type { SaveSingleCableCalculationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] UpdatingLeftConnector Succeeded';
  constructor(public payload: SaveSingleCableCalculationResponseDto) {}
}
