import type { FindCalculationConfigurationStatusByIdsRequestDto } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindCalculationConfigurationStatusByIdsDto implements FindCalculationConfigurationStatusByIdsRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  public calculationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  public configurationId: string;
}
