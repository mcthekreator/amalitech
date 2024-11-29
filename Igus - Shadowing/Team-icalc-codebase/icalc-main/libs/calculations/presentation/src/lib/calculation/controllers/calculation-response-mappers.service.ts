import type {
  AssignConfigurationItemsToCopiedCalculationResponseDto,
  Calculation,
  CalculationConfigurationApprovalStatusByConfigurationId,
  Configuration,
  ConfigurationsWithRemovedOverridesMap,
  CopyConfigurationToNewCalculationResponseDto,
  CreateCalculationAndConfigurationResponseDto,
  CreateNewConfigurationForExistingCalculationResponseDto,
  CopyConfigurationToExistingCalculationResponseDto,
  FindCalculationByIdResponseDto,
  Mat017ItemsBaseDataMap,
  AssignConfigurationToExistingCalculationResponseDto,
  RemoveLinkBetweenConfigurationAndCalculationResponseDto,
  RemoveMat017ItemsResponseDto,
  SetExcelDownloadFlagsForCalculationResponseDto,
  SingleCableCalculation,
  UpdateCalculationWithSCC,
  UpdateMat017ItemsOverridesInConfigurationsResponseDto,
} from '@igus/icalc-domain';
import { CalculationStatus, ObjectUtils } from '@igus/icalc-domain';
import { Injectable } from '@nestjs/common';
import { CalculationsPresentationMapperService } from '../../common';
import { PresentationMappers } from '@igus/icalc-common';

@Injectable()
export class CalculationResponseMappersService {
  constructor(private calculationsPresentationMapperService: CalculationsPresentationMapperService) {}

  public mapToFindCalculationByIdResponseDto(calculation: Calculation): FindCalculationByIdResponseDto {
    return {
      ...PresentationMappers.mapToCalculationPresentation(calculation),
    };
  }

  public mapToUpdateCalculationResponseDto(calculation: Partial<Calculation>): UpdateCalculationWithSCC {
    return {
      ...ObjectUtils.omitKeys(calculation, ['singleCableCalculations', 'status']),
      isLocked: calculation.status === CalculationStatus.locked,
    };
  }

  public mapToSetExcelDownloadFlagsForCalculationResponseDto(
    result: Partial<Calculation>
  ): SetExcelDownloadFlagsForCalculationResponseDto {
    return {
      ...ObjectUtils.omitKeys(result as Calculation, ['status', 'singleCableCalculations']),
      isLocked: result.status === CalculationStatus.locked,
    };
  }

  public mapToUpdateMat017ItemOverridesInConfigurationsResponseDto(
    configurations: Configuration[],
    mat017ItemBaseDataMap: Mat017ItemsBaseDataMap,
    resetApprovalResultMap: CalculationConfigurationApprovalStatusByConfigurationId,
    configurationsWithRemovedOverrides: ConfigurationsWithRemovedOverridesMap
  ): UpdateMat017ItemsOverridesInConfigurationsResponseDto {
    return configurations.map((config) => {
      const { connectorState, workStepOverrides } = PresentationMappers.mapToConfigurationStatePresentation(
        config.state,
        mat017ItemBaseDataMap
      );
      const calculationConfigurationStatus = resetApprovalResultMap.get(config.id) || { hasApprovalBeenRevoked: false };

      return {
        configurationId: config.id,
        matNumber: config.matNumber,
        connectorState,
        calculationConfigurationStatus,
        hasRemovedOverrides: configurationsWithRemovedOverrides.has(config.id),
        workStepOverrides,
        removedOverrides: configurationsWithRemovedOverrides.get(config.id) || [],
      };
    });
  }

  public mapToRemoveMat017ItemsResponseDto(
    configurations: Configuration[],
    mat017ItemBaseDataMap: Mat017ItemsBaseDataMap,
    resetApprovalResultMap: CalculationConfigurationApprovalStatusByConfigurationId,
    configurationsWithRemovedOverrides: ConfigurationsWithRemovedOverridesMap
  ): RemoveMat017ItemsResponseDto {
    return configurations.map((config) => {
      const { connectorState, workStepOverrides } = PresentationMappers.mapToConfigurationStatePresentation(
        config.state,
        mat017ItemBaseDataMap
      );
      const calculationConfigurationStatus = resetApprovalResultMap.get(config.id) || { hasApprovalBeenRevoked: false };

      return {
        configurationId: config.id,
        matNumber: config.matNumber,
        connectorState,
        workStepOverrides: workStepOverrides || {},
        calculationConfigurationStatus,
        hasRemovedOverrides: configurationsWithRemovedOverrides.has(config.id),
        removedOverrides: configurationsWithRemovedOverrides.get(config.id) || [],
      };
    });
  }

  public async mapToAssignConfigurationItemsToCopiedCalculationResponseDto(
    singleCableCalculation: SingleCableCalculation
  ): Promise<AssignConfigurationItemsToCopiedCalculationResponseDto> {
    return await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
      singleCableCalculation
    );
  }

  public async mapToCreateCalculationAndConfigurationResponseDto(
    singleCableCalculation: SingleCableCalculation
  ): Promise<CreateCalculationAndConfigurationResponseDto> {
    return await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
      singleCableCalculation
    );
  }

  public async mapToCreateNewConfigurationForExistingCalculationResponseDto(
    singleCableCalculation: SingleCableCalculation
  ): Promise<CreateNewConfigurationForExistingCalculationResponseDto> {
    return await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
      singleCableCalculation
    );
  }

  public async mapToCopyConfigurationToExistingCalculationResponseDto(
    singleCableCalculation: SingleCableCalculation
  ): Promise<CopyConfigurationToExistingCalculationResponseDto> {
    return await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
      singleCableCalculation
    );
  }

  public async mapToAssignConfigurationToExistingCalculationResponseDto(
    singleCableCalculation: SingleCableCalculation
  ): Promise<AssignConfigurationToExistingCalculationResponseDto> {
    return await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
      singleCableCalculation
    );
  }

  public async mapToRemoveLinkBetweenConfigurationAndCalculationResponseDto(
    singleCableCalculation: SingleCableCalculation
  ): Promise<RemoveLinkBetweenConfigurationAndCalculationResponseDto> {
    return await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
      singleCableCalculation
    );
  }

  public async mapToCopyConfigurationToNewCalculationResponseDto(
    singleCableCalculation: SingleCableCalculation
  ): Promise<CopyConfigurationToNewCalculationResponseDto> {
    return await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
      singleCableCalculation
    );
  }
}
