import type { HaveMat017ItemsOverridesChangedRequestDto } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class HaveMat017ItemsOverridesChangedDto implements HaveMat017ItemsOverridesChangedRequestDto {
  @ApiProperty({ description: 'Array of configuration IDs.', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  public configurationIds: string[];
}
