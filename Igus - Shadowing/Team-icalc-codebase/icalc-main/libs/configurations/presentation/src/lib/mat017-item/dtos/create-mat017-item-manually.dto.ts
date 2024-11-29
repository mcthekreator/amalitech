import {
  ICALC_MAT017_ITEM_MANUAL_CREATION_HARD_LIMIT,
  Mat017ItemNumberValidator,
  Mat017ItemPriceUnitCharEnum,
  PriceUnitCharCode,
} from '@igus/icalc-domain';
import type { CreateMat017ItemManuallyRequestDto, FindMat017ItemByMatNumberRequestDto } from '@igus/icalc-domain';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';

export class CreateMat017ItemManuallyDto implements CreateMat017ItemManuallyRequestDto {
  @ApiProperty({ description: 'The matNumber of the item' })
  @IsNotEmpty()
  @Validate(Mat017ItemNumberValidator)
  public matNumber: string;

  @ApiProperty({ description: 'The item group of the mat017Item' })
  @IsString()
  @IsNotEmpty()
  public mat017ItemGroup: string;

  @ApiProperty({ description: 'First description of the item' })
  @IsString()
  @IsNotEmpty()
  public itemDescription1: string;

  @ApiProperty({ description: 'Second description of the item' })
  @IsString()
  @IsOptional()
  public itemDescription2?: string;

  @ApiProperty({ description: 'Item group of the item' })
  @IsNotEmpty()
  @IsString()
  public supplierItemNumber: string;

  @ApiProperty({ description: 'Amount of the item' })
  @IsNotEmpty()
  @IsNumber()
  public amount: number;

  @ApiProperty({ description: 'The price unit of the item' })
  @IsNotEmpty()
  @IsEnum(Mat017ItemPriceUnitCharEnum, { message: 'priceUnit must be one of S, M, H, T' })
  public priceUnit: PriceUnitCharCode;
}

export class CreateMat017ItemsManuallyDto {
  @ValidateNested({ each: true })
  @Type(() => CreateMat017ItemManuallyDto)
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(ICALC_MAT017_ITEM_MANUAL_CREATION_HARD_LIMIT)
  @ArrayMinSize(1)
  public mat017Items: CreateMat017ItemManuallyDto[];
}

export class FindMat017ItemByMatNumberDto implements FindMat017ItemByMatNumberRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(Mat017ItemNumberValidator)
  public matNumber: string;
}
