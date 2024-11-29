import type { FindConfigurationByMatNumberRequestDto } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindConfigurationByMatNumberDto implements FindConfigurationByMatNumberRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public matNumber: string;
}
