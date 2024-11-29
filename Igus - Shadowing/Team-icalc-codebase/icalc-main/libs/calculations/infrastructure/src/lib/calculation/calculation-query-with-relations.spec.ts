import type { Calculation } from '@igus/icalc-domain';
import { CalculationQueryWithRelations, CalculationOrderBy } from './calculation-query-with-relations';

import type { SelectQueryBuilder } from 'typeorm';

class MockSelectQueryBuilder {
  public expressionMap = {
    selects: [],
  };
}

const mockQueryBuilderWithoutCalculation = new MockSelectQueryBuilder();

// Mock the expressionMap.selects to return a list without 'calculation'
mockQueryBuilderWithoutCalculation.expressionMap.selects = [
  { selection: 'singleCableCalculations' },
  { selection: 'configuration' },
  { selection: 'snapshot' },
];

const mockQueryBuilderWithCalculations = new MockSelectQueryBuilder();

// Mock the expressionMap.selects to return a list without 'calculation'
mockQueryBuilderWithCalculations.expressionMap.selects = [
  { selection: 'calculation' },
  { selection: 'singleCableCalculations' },
  { selection: 'configuration' },
  { selection: 'snapshot' },
];

describe('CalculationQueryWithRelations', () => {
  it('should throw an error if a required selection is missing', () => {
    expect(() => new CalculationQueryWithRelations(mockQueryBuilderWithoutCalculation as any)).toThrow(
      'calculation is a required selection in baseQuery'
    );
  });

  it('should not throw an error if all required selections are present', () => {
    expect(() => new CalculationQueryWithRelations(mockQueryBuilderWithCalculations as any)).not.toThrow();
  });
});

describe('CalculationOrderBy', () => {
  let queryBuilder: jest.Mocked<SelectQueryBuilder<Calculation>>;
  let listParameter;

  beforeEach(() => {
    // Mock SelectQueryBuilder
    queryBuilder = {
      ...mockQueryBuilderWithCalculations,
      addOrderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    } as any;

    // Define default listParameter
    listParameter = {
      skip: 0,
      take: 10,
    };
  });

  it('should call setupQueryWithOrderBy on construction', () => {
    new CalculationOrderBy(queryBuilder, listParameter);
    expect(queryBuilder.addOrderBy).toHaveBeenCalledTimes(2);
    expect(queryBuilder.offset).toHaveBeenCalledWith(listParameter.skip);
    expect(queryBuilder.limit).toHaveBeenCalledWith(listParameter.take);
  });

  it('should use default order by column when listParameter.orderBy is not specified', () => {
    new CalculationOrderBy(queryBuilder, listParameter);
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('calculation_number', 'DESC');
  });

  it('should use specified order by column when listParameter.orderBy is valid', () => {
    listParameter.orderBy = 'matNumber';
    new CalculationOrderBy(queryBuilder, listParameter);
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('mat_number', 'DESC');
  });

  it('should use default order by column when listParameter.orderBy is invalid', () => {
    listParameter.orderBy = 'invalidColumn';
    new CalculationOrderBy(queryBuilder, listParameter);
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('calculation_number', 'DESC');
  });

  it('should use ASC direction when listParameter.orderDirection is ASC', () => {
    listParameter.orderDirection = 'ASC';
    new CalculationOrderBy(queryBuilder, listParameter);
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('calculation_number', 'ASC');
  });

  it('should use DESC direction when listParameter.orderDirection is not ASC', () => {
    listParameter.orderDirection = 'DESC';
    new CalculationOrderBy(queryBuilder, listParameter);
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('calculation_number', 'DESC');
  });
});
