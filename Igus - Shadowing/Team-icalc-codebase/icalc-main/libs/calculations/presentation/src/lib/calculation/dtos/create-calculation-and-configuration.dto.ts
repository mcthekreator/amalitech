import {
  CreateConfigurationRequestDto,
  CreateCalculationRequestDto,
  SingleCableCalculationBaseData,
} from '@igus/icalc-domain';
import type {
  AssignConfigurationItemsToCopiedCalculationRequestDto,
  CreateCalculationAndConfigurationRequestDto,
  CreateNewConfigurationForExistingCalculationRequestDto,
} from '@igus/icalc-domain';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { CreateConfigurationDto } from './create-configuration.dto';
import { CreateCalculationDto } from './create-calculation.dto';

export class CreateNewConfigurationForExistingCalculationDto
  implements CreateNewConfigurationForExistingCalculationRequestDto
{
  @IsString()
  @IsNotEmpty()
  public calculationId: string;

  @IsNotEmpty()
  public configuration: CreateConfigurationDto;

  @IsNotEmpty()
  public singleCableCalculation: SingleCableCalculationBaseData;
}

export class CreateCalculationAndConfigurationDto implements CreateCalculationAndConfigurationRequestDto {
  @IsNotEmpty()
  public calculation: CreateCalculationRequestDto;

  @IsNotEmpty()
  public configuration: CreateConfigurationRequestDto;

  @IsNotEmpty()
  public singleCableCalculation: SingleCableCalculationBaseData;
}

export class AssignConfigurationItemsToCopiedCalculationDto
  implements AssignConfigurationItemsToCopiedCalculationRequestDto
{
  @ApiProperty()
  @IsString({ each: true })
  public singleCableCalculationIds: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public newCalculationNumber: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public newQuoteNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public newCustomer?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public createdBy: string;

  @IsString()
  @IsNotEmpty()
  public calculationId: string;
}

export class CopyConfigurationToNewCalculationDto extends CreateCalculationDto implements CreateCalculationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public configurationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public newMatNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public labelingLeft?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public labelingRight?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public batchSize: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public chainflexLength: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public updatePrices: boolean;
}
