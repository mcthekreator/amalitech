import type { CheckForNewChainflexPricesRequestDto } from '@igus/icalc-domain';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CheckForNewChainflexPricesDto implements CheckForNewChainflexPricesRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  public singleCableCalculationIds: string[];
}
