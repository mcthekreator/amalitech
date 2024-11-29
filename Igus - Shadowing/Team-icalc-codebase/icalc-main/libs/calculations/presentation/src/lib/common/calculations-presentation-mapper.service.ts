import { Mat017ItemDataAccessService } from '@igus/icalc-configurations-infrastructure';
import { PresentationMappers } from '@igus/icalc-common';
import {
  getConfigurationDataFromSingleCableCalculations,
  type Calculation,
  type FindCalculationByIdResponseDto,
  type SingleCableCalculation,
  type SingleCableCalculationPresentation,
} from '@igus/icalc-domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculationsPresentationMapperService {
  constructor(private mat017ItemDataAccessService: Mat017ItemDataAccessService) {}

  public mapToFindCalculationByIdResponseDto(calculation: Calculation): FindCalculationByIdResponseDto {
    return {
      ...PresentationMappers.mapToCalculationPresentation(calculation),
    };
  }

  public async mapManyToSingleCableCalculationPresentation(
    sccList: SingleCableCalculation[]
  ): Promise<SingleCableCalculationPresentation[]> {
    const newMatItemBaseDataToMatNumberMap = await this.mat017ItemDataAccessService.generateMat017ItemBaseDataMap(
      getConfigurationDataFromSingleCableCalculations(sccList)
    );

    return sccList.map((scc) =>
      PresentationMappers.mapToSingleCableCalculationPresentation(scc, true, newMatItemBaseDataToMatNumberMap)
    );
  }

  public async mapOneToSingleCableCalculationPresentation(
    scc: SingleCableCalculation
  ): Promise<SingleCableCalculationPresentation> {
    const newMatItemBaseDataToMatNumberMap = await this.mat017ItemDataAccessService.generateMat017ItemBaseDataMap(
      getConfigurationDataFromSingleCableCalculations([scc])
    );

    return {
      ...PresentationMappers.mapToSingleCableCalculationPresentation(scc, true, newMatItemBaseDataToMatNumberMap),
    };
  }
}
