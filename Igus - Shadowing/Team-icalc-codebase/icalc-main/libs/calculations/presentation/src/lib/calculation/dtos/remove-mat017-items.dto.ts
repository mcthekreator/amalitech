import type { RemoveMat017ItemsConfiguration, RemoveMat017ItemsRequestDto } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsUUID, IsString } from 'class-validator';

class RemoveMat017ItemsConfigurationDto implements RemoveMat017ItemsConfiguration {
  @ApiProperty({ description: 'The unique identifier of the configuration.' })
  @IsUUID()
  public configurationId: string;

  @ApiProperty({ description: 'Array of mat017Items matNumbers.' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  public mat017Items: string[];
}

export class RemoveMat017ItemsDto implements RemoveMat017ItemsRequestDto {
  @ApiProperty({ description: 'The unique identifier of the calculation.' })
  @IsUUID()
  public calculationId: string;

  @ApiProperty({ description: 'Array of to be removed configurations.' })
  @IsArray()
  @ArrayNotEmpty()
  public configurations: RemoveMat017ItemsConfigurationDto[];
}
