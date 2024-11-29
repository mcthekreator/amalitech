import type { RemoveChainflexDataRequestDto } from '@igus/icalc-domain';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class RemoveChainflexDataDto implements RemoveChainflexDataRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  public singleCableCalculationIds: string[];
}
