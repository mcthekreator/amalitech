import type { UpdateChainflexPricesRequestDto } from '@igus/icalc-domain';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class UpdateChainflexPricesDto implements UpdateChainflexPricesRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  public singleCableCalculationIds: string[];
}
