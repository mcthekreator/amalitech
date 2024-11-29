import type { Calculation, CalculationOrderByColumns, IcalcListInformation } from '@igus/icalc-domain';
import type { SelectQueryBuilder } from 'typeorm';

export class CalculationQueryWithRelations {
  constructor(public baseQuery: SelectQueryBuilder<Calculation>) {
    const requiredSelects = ['calculation'];
    const selects = baseQuery.expressionMap.selects.map((select) => select.selection);

    for (const select of requiredSelects) {
      if (!selects.includes(select)) {
        throw Error(`${select} is a required selection in baseQuery`);
      }
    }
  }
}

export class CalculationFilterQueryWithSearch extends CalculationQueryWithRelations {
  constructor(
    public override baseQuery: SelectQueryBuilder<Calculation>,
    search: string
  ) {
    super(
      baseQuery.andWhere(
        `(calculation.calculationNumber ilike :search or configuration.mat_number ilike :search or snapshot.configuration_data ->> 'matNumber' ilike :search)`,
        {
          search: `%${search}%`,
        }
      )
    );
  }
}

export class CalculationFilterWithCustomerType extends CalculationQueryWithRelations {
  constructor(
    public override baseQuery: SelectQueryBuilder<Calculation>,
    customerType: string
  ) {
    super(
      baseQuery.andWhere('calculation.customerType ilike :customerType', {
        customerType: `%${customerType}%`,
      })
    );
  }
}

export class CalculationFilterWithCalculationFactor extends CalculationQueryWithRelations {
  constructor(
    public override baseQuery: SelectQueryBuilder<Calculation>,
    operand: string,
    calculationFactor: number
  ) {
    super(baseQuery.andWhere(`calculation.calculation_factor ${operand} ${calculationFactor}`));
  }
}

export class CalculationOrderBy extends CalculationQueryWithRelations {
  private readonly orderByColumnsMap: CalculationOrderByColumns = {
    calculationNumber: 'calculation_number',
    matNumber: 'mat_number',
    labelingLeft: 'labeling_left',
    labelingRight: 'labelingRight',
    batchSize: 'batch_size',
    calculationFactor: 'calculation.calculation_factor',
    customerType: 'customer_type',
    creationDate: 'calculation.creation_date',
    createdBy: 'calculation.created_by',
    modificationDate: 'calculation.modification_date',
    modifiedBy: 'calculation.modified_by',
    lockingDate: 'calculation.locking_date',
    lockedBy: 'calculation.locked_by',
  };

  private readonly defaultOrderBy = this.orderByColumnsMap.calculationNumber;

  constructor(
    public override baseQuery: SelectQueryBuilder<Calculation>,
    private listParameter: IcalcListInformation
  ) {
    super(baseQuery);
    this.setupQueryWithOrderBy();
  }

  private setupQueryWithOrderBy(): void {
    this.baseQuery
      .addOrderBy(
        this.getOrderByColumn(),
        this.listParameter.orderDirection?.toUpperCase?.() === 'ASC' ? 'ASC' : 'DESC'
      )
      .addOrderBy('singleCableCalculations.assignment_date', 'ASC') // The recently created SingleCableCalculations are expected to be at the end of the list
      .offset(this.listParameter.skip)
      .limit(this.listParameter.take);
  }

  private getOrderByColumn(): string {
    let orderBy = this.defaultOrderBy;

    if (this.listParameter.orderBy) {
      orderBy = this.orderByColumnsMap[this.listParameter.orderBy] || this.defaultOrderBy;
    }

    return orderBy;
  }
}
