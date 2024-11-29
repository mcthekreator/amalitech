import type { SingleCableCalculationPresentation, UpdateCalculationRequestDto } from '@igus/icalc-domain';
import { CustomerTypeEnum } from '@igus/icalc-domain';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateCalculationDto implements UpdateCalculationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public calculationNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public quoteNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public customer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public calculationFactor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public mat017ItemRiskFactor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public mat017ItemAndWorkStepRiskFactor?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsIn(['serialCustomer', 'betriebsMittler'])
  public customerType?: CustomerTypeEnum;

  @IsOptional()
  public singleCableCalculation?: Partial<SingleCableCalculationPresentation>;
}
