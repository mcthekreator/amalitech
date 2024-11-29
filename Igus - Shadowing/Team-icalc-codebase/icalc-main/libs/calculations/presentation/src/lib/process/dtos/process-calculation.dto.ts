import type { ProcessCalculationRequestDto } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ProcessCalculationDto implements ProcessCalculationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID(4)
  public calculationId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  public singleCableCalculationIds: string[];
}
