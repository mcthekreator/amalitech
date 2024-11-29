import { Injectable } from '@nestjs/common';
import { CalculationsPresentationMapperService } from '../../common';
import type {
  SaveSingleCableCalculationResponseDto,
  SingleCableCalculation,
  SingleCableCalculationPresentation,
  RemoveChainflexDataResult,
  RemoveChainflexDataResponseDto,
} from '@igus/icalc-domain';
import { ObjectUtils } from '@igus/icalc-domain';

@Injectable()
export class SingleCableCalculationResponseMapperService {
  constructor(private calculationsPresentationMapperService: CalculationsPresentationMapperService) {}

  public async mapToSaveSingleCableCalculationResponseDto(
    singleCableCalculation: SingleCableCalculation,
    calculationConfigurationStatus: { hasApprovalBeenRevoked: boolean }
  ): Promise<SaveSingleCableCalculationResponseDto> {
    const sccPresentation =
      await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
        singleCableCalculation
      );

    return {
      singleCableCalculation: {
        ...sccPresentation,
        calculation: {
          ...ObjectUtils.omitKeys(sccPresentation.calculation, ['singleCableCalculations']),
        },
        configuration: {
          ...ObjectUtils.omitKeys(sccPresentation.configuration, ['singleCableCalculations']),
        },
        snapshot: {
          ...ObjectUtils.omitKeys(sccPresentation.snapshot, ['singleCableCalculations']),
        },
      },
      calculationConfigurationStatus,
    };
  }

  public async mapToRemoveChainflexDataResponseDto(
    removeChainflexDataResult: RemoveChainflexDataResult
  ): Promise<RemoveChainflexDataResponseDto> {
    const response: RemoveChainflexDataResponseDto = {
      savedSingleCableCalculations: [],
    };

    const promises: Promise<SaveSingleCableCalculationResponseDto>[] = [];

    removeChainflexDataResult.savedSingleCableCalculations.forEach((savedSCCResult) => {
      promises.push(
        this.mapToSaveSingleCableCalculationResponseDto(
          savedSCCResult.singleCableCalculation,
          savedSCCResult.calculationConfigurationStatus
        )
      );
    });

    response.savedSingleCableCalculations = await Promise.all(promises);
    return response;
  }

  public async mapToGetOneSingleCableCalculationResponseDto(
    singleCableCalculation: SingleCableCalculation
  ): Promise<SingleCableCalculationPresentation> {
    return await this.calculationsPresentationMapperService.mapOneToSingleCableCalculationPresentation(
      singleCableCalculation
    );
  }
}
