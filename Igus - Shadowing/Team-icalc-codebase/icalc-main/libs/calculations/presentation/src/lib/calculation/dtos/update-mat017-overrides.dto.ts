import { Mat017ItemOverridesEnum } from '@igus/icalc-domain';
import type { UpdateMat017OverridesRequestDto } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsUUID, IsEnum } from 'class-validator';

export class UpdateMat017OverridesDto implements UpdateMat017OverridesRequestDto {
  @ApiProperty({ description: 'The unique identifier of the calculation.' })
  @IsUUID()
  public calculationId: string;

  @ApiProperty({ description: 'Array of configuration IDs.', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  public configurationIds: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Mat017ItemOverridesEnum, { each: true })
  @ApiProperty({ description: 'Array of override properties.', enum: Mat017ItemOverridesEnum, isArray: true })
  public updateProperties: Mat017ItemOverridesEnum[];
}
