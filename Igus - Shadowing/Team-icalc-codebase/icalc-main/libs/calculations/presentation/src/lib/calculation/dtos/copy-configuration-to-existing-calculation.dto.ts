import type { CopyConfigurationToExistingCalculationRequestDto } from '@igus/icalc-domain';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CopyConfigurationToExistingCalculationDto implements CopyConfigurationToExistingCalculationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public configurationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public newMatNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public createdBy: string;

  @IsString()
  @IsNotEmpty()
  public calculationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public labelingLeft?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public labelingRight?: string;

  @ApiProperty()
  @IsNumber()
  public batchSize: number;

  @ApiProperty()
  @IsNumber()
  public chainflexLength: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public updatePrices: boolean;
}
