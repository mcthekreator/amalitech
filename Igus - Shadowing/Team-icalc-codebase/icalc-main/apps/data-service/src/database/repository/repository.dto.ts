import { IsOptional, IsString } from 'class-validator';

export class GetAllQueryParamsDto {
  /**
   * Model schema version
   */
  @IsString()
  @IsOptional()
  public schemaVersion?: string;
}

export class GetOneQueryParamsDto extends GetAllQueryParamsDto {}
