import { Configuration } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SaveConfigurationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  public calculationId: string;

  @ApiProperty()
  @IsNotEmpty()
  public configuration: Configuration;
}
