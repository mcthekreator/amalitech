import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';

export class FavoritesToMat017ItemDto {
  @IsNotEmpty()
  @IsString()
  public matNumber: string;

  @IsNumber()
  @IsPositive()
  public amount: number;
}

export class FavoritesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FavoritesToMat017ItemDto)
  public favoritesToMat017ItemsDto: FavoritesToMat017ItemDto[];
}
