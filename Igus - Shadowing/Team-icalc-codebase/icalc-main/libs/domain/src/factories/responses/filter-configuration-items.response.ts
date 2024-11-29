import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { FilterConfigurationResponseDto } from '../../dtos';
import { createTestUserFullName } from '../objects';
import { ICALC_DYNAMIC_CALC_NUMBER_PREFIX, ICALC_DYNAMIC_MAT_NUMBER_PREFIX } from '../../constants';

const filterConfigurationItemsWithNoFilterResponse: FilterConfigurationResponseDto = {
  data: [
    {
      createdBy: createTestUserFullName(),
      creationDate: new Date(),
      id: '2ab81d46-2767-490c-95fe-4483c3e7a690',
      isCopyOfConfigurationId: undefined,
      labelingLeft: 'left label',
      labelingRight: 'right label',
      matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfiguration-unlikely-matNumber`,
      modificationDate: new Date(),
      modifiedBy: createTestUserFullName(),
      partNumber: 'CF08.15.test',
      calculationNumbers: [`${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculation-unlikely-calculationNumber`],
    },
    {
      createdBy: createTestUserFullName(),
      creationDate: new Date(),
      id: '2ab81d46-2767-490c-95fe-4483c3e7a691',
      isCopyOfConfigurationId: undefined,
      labelingLeft: 'left label',
      labelingRight: 'right label',
      matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationForLocking-unlikely-matNumber`,
      modificationDate: new Date(),
      modifiedBy: createTestUserFullName(),
      partNumber: 'CF08.15.test',
      calculationNumbers: [
        `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-e2e-icalcTestCalculationForLocking-unlikely-calculationNumber`,
      ],
    },
    {
      createdBy: createTestUserFullName(),
      creationDate: new Date(),
      id: '2ab81d46-2767-490c-95fe-4483c3e7a692',
      isCopyOfConfigurationId: undefined,
      labelingLeft: 'left label',
      labelingRight: 'right label',
      matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcLockedTestConfiguration-unlikely-matNumber`,
      modificationDate: new Date(),
      modifiedBy: createTestUserFullName(),
      partNumber: 'CF08.15.test',
      calculationNumbers: [`${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcLockedTestCalculation-unlikely-calculationNumber`],
    },
    {
      createdBy: createTestUserFullName(),
      creationDate: new Date(),
      id: '2ab81d46-2767-490c-95fe-4483c3e7a693',
      isCopyOfConfigurationId: undefined,
      labelingLeft: 'left label',
      labelingRight: 'right label',
      matNumber: `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-matNumber`,
      modificationDate: new Date(),
      modifiedBy: createTestUserFullName(),
      partNumber: 'CF08.15.test',
      calculationNumbers: [
        `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestCalculation-unlikely-calculationNumber`,
      ],
    },
  ],
  listParameter: {
    orderBy: 'matNumber',
    orderDirection: 'asc',
    search: '',
    skip: 0,
    take: 100,
  },
  totalCount: 4,
};

/**
 * createFilterConfigurationResponse creates a FilterConfigurationResponseDto
 *
 * @param override pass any needed overrides for the requested FilterConfigurationResponseDto
 * @returns FilterConfigurationResponseDto
 */
export const createFilterConfigurationResponse = (
  override?: NestedPartial<FilterConfigurationResponseDto>
): FilterConfigurationResponseDto => {
  return mergePartially.deep(filterConfigurationItemsWithNoFilterResponse, override);
};
