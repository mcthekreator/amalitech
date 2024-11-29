import type { FindCalculationByCalculationNumberRequestDto, FindCalculationByIdRequestDto } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindCalculationByCalculationNumberDto implements FindCalculationByCalculationNumberRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public calculationNumber: string;
}

export class FindCalculationByIdDto implements FindCalculationByIdRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id: string;
}
