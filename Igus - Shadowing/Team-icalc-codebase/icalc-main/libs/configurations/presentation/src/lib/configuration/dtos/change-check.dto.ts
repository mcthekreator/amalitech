import type { ChangeCheckRequestDto } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

enum StepName {
  'chainflex' = 'chainflex',
  'connector' = 'connector',
  'library' = 'library',
  'pinAssignment' = 'pinAssignment',
}

export class ChangeCheckDto implements ChangeCheckRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  public configurationId: string;

  @ApiProperty()
  @IsEnum(StepName)
  public step: StepName;

  @ApiProperty()
  public state: object;
}
