import { IcalcLocale } from '@igus/icalc-domain';
import type { CreateExcelProductionPlanFileRequestDto, FileDownloadOptions } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateExcelProductionPlanFileDto implements CreateExcelProductionPlanFileRequestDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(4, { each: true })
  public singleCableCalculationIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public locale: IcalcLocale;

  @ApiProperty()
  @IsNotEmpty()
  public fileDownloadOptions: FileDownloadOptions;
}
