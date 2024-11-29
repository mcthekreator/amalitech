import {
  IcalcListResult,
  Configuration,
  FilterConfigurationResponseDto,
  FindConfigurationResponseDto,
  UpdateConfigurationResponseDto,
} from '@igus/icalc-domain';
import { ObjectUtils } from '@igus/icalc-utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationsPresentationMapperService {
  public mapToFilterConfigurationResponseDto(result: IcalcListResult<Configuration>): FilterConfigurationResponseDto {
    return {
      ...result,
      data: result.data.map((config) => ({
        ...ObjectUtils.omitKeys(config, ['singleCableCalculations', 'state', 'snapshots']),
        calculationNumbers: [
          ...config.singleCableCalculations.map((value) => value.calculation?.calculationNumber),
          ...config.snapshots.map((value) => value.singleCableCalculation?.calculation?.calculationNumber),
        ],
      })),
    };
  }

  public mapToFindOneConfigurationResponseDto(result: Configuration): FindConfigurationResponseDto {
    const ignoredProperties = ['singleCableCalculations', 'state', 'snapshots'] as Array<keyof Configuration>;

    return ObjectUtils.omitKeys(result, ignoredProperties) as FindConfigurationResponseDto;
  }

  public mapToUpdatedConfiguration(result: Configuration): UpdateConfigurationResponseDto {
    const selectProperties = ['description', 'modificationDate', 'modifiedBy'] as Array<keyof Configuration>;

    return ObjectUtils.pickKeys(result, selectProperties) as UpdateConfigurationResponseDto;
  }
}
