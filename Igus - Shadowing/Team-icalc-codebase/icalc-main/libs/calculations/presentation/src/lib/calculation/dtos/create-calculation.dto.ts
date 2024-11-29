import type { CreateCalculationRequestDto } from '@igus/icalc-domain';
import { CustomerTypeEnum } from '@igus/icalc-domain';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCalculationDto implements CreateCalculationRequestDto {
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

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  public calculationFactor: number;

  @ApiProperty({ type: String })
  @IsIn(['serialCustomer', 'betriebsMittler'])
  public customerType: CustomerTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public createdBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  public configurationMatNumbers?: string[];
}
