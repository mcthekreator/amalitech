import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { FilterCalculationResponseDto } from '../../dtos';
import { CustomerTypeEnum } from '../../models';
import { createTestUserFullName } from '../objects';
import { ICALC_DYNAMIC_CALC_NUMBER_PREFIX, ICALC_DYNAMIC_MAT_NUMBER_PREFIX } from '../../constants';

const filterCalculationItemsWithNoFilterResponse: FilterCalculationResponseDto = {
  data: [
    {
      calculationFactor: 1,
      customer: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-customer`,
      quoteNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-quoteNumber`,
      calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcTestCalculation-unlikely-calculationNumber`,
      createdBy: createTestUserFullName(),
      creationDate: new Date(),
      customerType: CustomerTypeEnum.serialCustomer,
      id: 'ba4d7aa4-91a4-4ce5-b1f4-5cdc7502ade9',
      modificationDate: new Date(),
      modifiedBy: createTestUserFullName(),
      matNumbers: [`${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfiguration-unlikely-matNumber`],
      isLocked: false,
    },
    {
      calculationFactor: 1,
      customer: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-customer`,
      quoteNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-quoteNumber`,
      calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-TestCalculationForLocking-unlikely-calculationNumber`,
      createdBy: createTestUserFullName(),
      creationDate: new Date(),
      customerType: CustomerTypeEnum.serialCustomer,
      id: '50257e87-cb05-4589-9e4e-e5f8e50872ec',
      modificationDate: new Date(),
      modifiedBy: createTestUserFullName(),
      matNumbers: [`${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationForLocking-unlikely-matNumber`],
      isLocked: false,
    },
    {
      calculationFactor: 1,
      customer: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-customer`,
      quoteNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-quoteNumber`,
      calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcLockedTestCalculation-unlikely-calculationNumber`,
      createdBy: createTestUserFullName(),
      creationDate: new Date(),
      customerType: CustomerTypeEnum.serialCustomer,
      id: 'c07e31a1-26d5-438e-96b7-59bab2b72b8b',
      isLocked: true,
      modificationDate: new Date(),
      modifiedBy: createTestUserFullName(),
      matNumbers: [`${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcLockedTestConfiguration-unlikely-matNumber`],
    },
    {
      calculationFactor: 1,
      customer: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-customer`,
      quoteNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-quoteNumber`,
      calculationNumber: `${ICALC_DYNAMIC_CALC_NUMBER_PREFIX}-icalcIncompleteTestConfiguration-unlikely-matNumber`,
      createdBy: createTestUserFullName(),
      creationDate: new Date(),
      customerType: CustomerTypeEnum.serialCustomer,
      id: '664fce04-ad64-4674-8462-6ae08095d2d4',
      modificationDate: new Date(),
      modifiedBy: createTestUserFullName(),
      matNumbers: [`${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}-icalcTestConfigurationForLocking-unlikely-matNumber`],
      isLocked: false,
    },
  ],
  listParameter: {
    orderBy: 'calculationNumber',
    orderDirection: 'asc',
    search: '',
    skip: 0,
    take: 100,
  },
  totalCount: 4,
};

/**
 * createFilterCalculationResponse creates a FilterCalculationResponseDto
 *
 * @param override pass any needed overrides for the requested FilterCalculationResponseDto
 * @returns FilterCalculationResponseDto
 */
export const createFilterCalculationResponse = (
  override?: NestedPartial<FilterCalculationResponseDto>
): FilterCalculationResponseDto => {
  return mergePartially.deep(filterCalculationItemsWithNoFilterResponse, override);
};
