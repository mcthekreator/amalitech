import type { SaveSingleCableCalculationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] UpdatingLibrary Succeeded';
  constructor(public payload: SaveSingleCableCalculationResponseDto) {}
}