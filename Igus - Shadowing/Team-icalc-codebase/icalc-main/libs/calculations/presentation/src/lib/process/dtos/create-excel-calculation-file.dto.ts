import type { CreateExcelCalculationFileRequestDto, ExcelProcessResult, FileDownloadOptions } from '@igus/icalc-domain';
import { CustomerTypeEnum, IcalcLocale } from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateExcelCalculationFileDto implements CreateExcelCalculationFileRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public calculationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public customerType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CustomerTypeEnum)
  public customerTypeEnum: CustomerTypeEnum;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  public processResults: ExcelProcessResult[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  public singleCableCalculationIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public locale: IcalcLocale;

  @ApiProperty()
  @IsNotEmpty()
  public fileDownloadOptions: FileDownloadOptions;
}
