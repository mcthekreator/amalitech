import type { SetExcelDownloadFlagsForCalculationRequestDto } from '@igus/icalc-domain';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class SetExcelDownloadFlagsForCalculationDto implements SetExcelDownloadFlagsForCalculationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public calculationNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public productionPlanExcelDownloaded?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public calculationExcelDownloaded?: boolean;
}
