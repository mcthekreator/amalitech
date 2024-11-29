import { ConfigurationState } from '@igus/icalc-domain';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateConfigurationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public matNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public labelingLeft?: string; // optional in DB therefore optional here

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public labelingRight?: string; // optional in DB therefore optional here

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public batchSize?: number; // optional in DB therefore optional here

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public partNumber?: string; // optional in DB therefore optional here

  @ApiPropertyOptional()
  @IsOptional()
  public state?: ConfigurationState;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public modifiedBy: string;
}
