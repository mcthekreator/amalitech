import type {
  IcalcArrow,
  IcalcBox,
  IcalcCircle,
  IcalcComment,
  IcalcImage,
  IcalcLine,
  SaveConfigurationData,
  WorkStepType,
  SaveSingleCableCalculationRequestData,
  SaveSnapshotRequestData,
  IcalcLibrary,
  CommercialWorkStepOverrides,
  RemoveChainflexDataRequestDto,
  ConfigurationStatePresentation,
  OneSideOfConfigurationConnectorPresentation,
} from '@igus/icalc-domain';
import {
  ConfigurationChainFlexState,
  ConfigurationPinAssignmentState,
  WorkStepSet,
  ConfigurationConnectorStatePresentation,
} from '@igus/icalc-domain';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class ConfigurationLibraryStateDto implements IcalcLibrary {
  @ApiProperty()
  @IsNotEmpty()
  public imageList: IcalcImage[];

  @ApiProperty()
  @IsNotEmpty()
  public commentList: IcalcComment[];

  @ApiProperty()
  @IsNotEmpty()
  public boxList: IcalcBox[];

  @ApiProperty()
  @IsNotEmpty()
  public circleList: IcalcCircle[];

  @ApiProperty()
  @IsNotEmpty()
  public lineList: IcalcLine[];

  @ApiProperty()
  @IsNotEmpty()
  public arrowList: IcalcArrow[];

  @ApiProperty()
  @IsNotEmpty()
  public leftChainFlex: {
    fontSize: number;
    text: string;
  };

  @ApiProperty()
  @IsNotEmpty()
  public rightChainFlex: {
    fontSize: number;
    text: string;
  };

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public fontSizeLeft: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public fontSizeRight: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public labelTextLeft: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public labelTextRight: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public leftMarkerDistance: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public rightMarkerDistance: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public sketchDate: string;

  @ApiProperty()
  @IsString()
  public base64Image: string;
}

export class ConfigurationConnectorStateDto implements ConfigurationConnectorStatePresentation {
  @ApiProperty()
  public leftConnector: OneSideOfConfigurationConnectorPresentation;

  @ApiProperty()
  public rightConnector: OneSideOfConfigurationConnectorPresentation;
}

export class ConfigurationStateRequestDto implements ConfigurationStatePresentation {
  @ApiProperty()
  @ValidateIf((o) => o.libraryState !== null)
  @ValidateNested()
  @Type(() => ConfigurationLibraryStateDto)
  public libraryState: ConfigurationLibraryStateDto;

  @ApiProperty()
  @IsOptional()
  public connectorState: ConfigurationConnectorStatePresentation;

  @ApiProperty()
  @IsOptional()
  public pinAssignmentState: ConfigurationPinAssignmentState;

  @ApiProperty()
  @IsOptional()
  public workStepOverrides: { [key in WorkStepType]?: number };

  @ApiProperty()
  @IsOptional()
  public chainFlexState: ConfigurationChainFlexState;

  @ApiProperty()
  @IsEnum(WorkStepSet)
  @IsOptional()
  public workStepSet: WorkStepSet;
}

export class SaveConfigurationRequestDto implements SaveConfigurationData {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  public id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public labelingLeft: string;

  @ApiProperty()
  @IsOptional()
  public labelingRight: string;

  @ApiProperty()
  @IsOptional()
  public description: string;

  @ApiProperty()
  @IsOptional()
  public partNumber: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConfigurationStateRequestDto)
  public state: ConfigurationStateRequestDto;
}

export class SaveSnapshotRequestDto implements SaveSnapshotRequestData {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  public id: string;

  @ApiProperty()
  @ValidateIf((o) => o.libraryState !== null)
  @ValidateNested()
  @Type(() => ConfigurationLibraryStateDto)
  public libraryState: ConfigurationLibraryStateDto;

  @ApiProperty()
  @ValidateIf((o) => o.connectorState !== null)
  @ValidateNested()
  @Type(() => ConfigurationConnectorStateDto)
  public connectorState: ConfigurationConnectorStateDto;
}

export class SaveSingleCableCalculationRequestDto implements SaveSingleCableCalculationRequestData {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  public id: string;

  @ApiProperty()
  @ValidateIf((o) => !o.snapshot)
  @ValidateNested()
  @Type(() => SaveConfigurationRequestDto)
  public configuration?: SaveConfigurationRequestDto;

  @ApiProperty()
  @ValidateIf((o) => !o.configuration)
  @ValidateNested()
  @Type(() => SaveSnapshotRequestDto)
  public snapshot?: SaveSnapshotRequestDto;

  public calculationFactor: number;
  public quoteNumber: string;
  public customer: string;
  public batchSize: number;
  public chainflexLength: number;
  public assignedBy: string;
  public assignmentDate: Date;
  public commercialWorkStepOverrides: CommercialWorkStepOverrides;
}

export class CheckForNewChainflexPricesRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  public singleCableCalculationIds: string[];
}

export class UpdateChainflexPricesRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  public singleCableCalculationIds: string[];
}

export class RemoveChainflexDataDto implements RemoveChainflexDataRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  public singleCableCalculationIds: string[];
}
