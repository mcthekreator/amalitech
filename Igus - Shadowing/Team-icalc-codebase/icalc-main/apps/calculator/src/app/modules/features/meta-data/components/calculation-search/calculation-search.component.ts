import type { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Input, ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { PageEvent } from '@angular/material/paginator';
import type { Sort, SortDirection } from '@angular/material/sort';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { SearchStateFacadeService } from '@icalc/frontend/app/modules/core/state/search-state/search-state-facade.service';

import type {
  CalculationPresentation,
  CalculationSearchResult,
  FormlyFormSettings,
  IcalcCalculationOperands,
  IcalcHTTPError,
  IcalcListInformation,
  IcalcMetaData,
  IcalcMetaDataFilter,
} from '@igus/icalc-domain';
import { ObjectUtils, StringUtils } from '@igus/icalc-utils';
import type { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-calculation-search',
  templateUrl: './calculation-search.component.html',
  styleUrls: ['./calculation-search.component.scss'],
})
export class CalculationSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public selectedIndexChange$: Observable<number>;

  @Input()
  public selectedCalculationId: string = null;

  public noCalculationItemsFound$: Observable<boolean>;
  public calculationTotalCount$: Observable<number>;
  public isLoadingCalculationItems$: Observable<boolean>;
  public calculationItems$: Observable<CalculationSearchResult[]>;

  // FILTER, SORT & SEARCH
  public calculationFilterSource: Partial<IcalcMetaDataFilter & IcalcCalculationOperands> = {};
  public calculationSearchInitiated = false;
  public calculationSearchError$: Observable<IcalcHTTPError>;
  public calculationListInformation$: Observable<IcalcListInformation>;
  public calculationSortActive: string;
  public calculationSortDirection: SortDirection = 'asc';

  public readonly calcColumnsToDisplay = [
    'calculationStatus',
    'calculationNumber',
    'matNumbers',
    'calculationFactor',
    'customerType',
    'creationDate',
    'createdBy',
    'modificationDate',
    'modifiedBy',
    'lockingDate',
    'lockedBy',
  ];

  public calculationFilterForm: FormlyFormSettings<Partial<IcalcMetaData & IcalcCalculationOperands>> = {
    form: new FormGroup({}),
    model: { calculationFactorOperand: '=' },
    options: {} as FormlyFormOptions,
    fields: [
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        fieldGroup: [
          {
            key: 'customerType',
            type: 'select',
            className: 'grow-1',
            props: {
              label: 'icalc.meta_data.CUSTOMER-TYPE',
              placeholder: 'icalc.meta_data.CUSTOMER-TYPE',
              translate: true,
              attributes: {
                dataCy: 'customer-type-select-filter',
              },
              options: [
                {
                  value: 'serialCustomer',
                  label: 'icalc.meta_data.CUSTOMER-SERIAL-CUSTOMER',
                },
                {
                  value: 'betriebsMittler',
                  label: 'icalc.meta_data.CUSTOMER-BETRIEBSMITTLER',
                },
              ],
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        fieldGroup: [
          {
            key: 'calculationFactor',
            type: 'input',
            className: 'grow-1',
            props: {
              type: 'number',
              min: 0,
              step: 0.01,
              attributes: {
                onpaste: 'return false;',
                dataCy: 'assign-calculation-factor-filter',
              },
              label: 'icalc.meta_data.CALCULATION-FACTOR',
              placeholder: 'icalc.meta_data.CALCULATION-FACTOR',
              translate: true,
              appearance: 'outline',
            },
          },
          {
            key: 'calculationFactorOperand',
            type: 'select',
            className: 'icalc-small-select-control',
            props: {
              translate: true,
              options: [
                { value: '=', label: '=' },
                { value: '<', label: '<' },
                { value: '>', label: '>' },
              ],
              attributes: {
                dataCy: 'assign-calculation-factor-operand-filter',
              },
            },
            expressions: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'props.disabled': `!model.calculationFactor || model.calculationFactor < 0`,
            },
          },
        ],
      },
    ] as FormlyFieldConfig[],
  };

  public calculationSearchForm: FormlyFormSettings<{ search: string }> = {
    form: new FormGroup({}),
    model: { search: '' },
    options: {} as FormlyFormOptions,
    fields: [
      {
        key: 'searchCalculation',
        className: 'searchCalculation',
        type: 'input',
        props: {
          addonRight: {
            icon: 'search',
          },
          label: 'icalc.meta_data.SEARCH-CALC-NUMBER',
          placeholder: 'icalc.meta_data.SEARCH-CALC-NUMBER',
          translate: true,
          appearance: 'outline',
          required: false,
          attributes: {
            dataCy: 'calculation-search-form-input',
          },
        },
      },
    ] as FormlyFieldConfig[],
  };

  private readonly subscription = new Subscription();

  constructor(
    private processStateFacadeService: ProcessStateFacadeService,
    private searchStateFacadeService: SearchStateFacadeService
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.selectedIndexChange$.subscribe((value) => {
        if (value === 1) {
          this.filterCalculationItems();
        } else {
          this.resetSearchAndFilterForms();
        }
      })
    );

    this.subscription.add(
      this.searchStateFacadeService.calculationListInformation$.subscribe((value) => {
        this.calculationSortActive = value.orderBy;
        this.calculationSortDirection = value.orderDirection;
      })
    );

    this.calculationItems$ = this.searchStateFacadeService.calculationItems$;
    this.calculationListInformation$ = this.searchStateFacadeService.calculationListInformation$;
    this.calculationTotalCount$ = this.searchStateFacadeService.calculationTotalCount$;
    this.calculationSearchInitiated = true;
    this.calculationSearchError$ = this.searchStateFacadeService.calculationSearchError$;
    this.noCalculationItemsFound$ = this.searchStateFacadeService.noCalculationItemsFound$;
    this.isLoadingCalculationItems$ = this.searchStateFacadeService.isLoadingCalculationItems$;
  }

  public ngAfterViewInit(): void {
    this.subscription.add(
      this.calculationSearchForm.form
        .get('searchCalculation')
        .valueChanges.pipe(debounceTime(450), distinctUntilChanged())
        .subscribe((value) => {
          this.filterCalculationItems({ search: value, skip: 0 });
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onApplyCalculationFilter(): void {
    this.calculationFilterSource = ObjectUtils.cloneDeep<Partial<IcalcMetaData & IcalcCalculationOperands>>(
      this.calculationFilterForm.model
    );

    this.filterCalculationItems({
      search: StringUtils.coerceString(this.calculationSearchForm.form.get('searchCalculation').value),
    });
  }

  public onRemoveCalculationFilter(filterPropertyName: string): void {
    if (!filterPropertyName || !this.calculationFilterSource[filterPropertyName]) {
      return;
    }
    delete this.calculationFilterSource[filterPropertyName];
    this.calculationFilterForm.model = ObjectUtils.cloneDeep<Partial<IcalcMetaData & IcalcCalculationOperands>>(
      this.calculationFilterSource
    );

    this.calculationFilterForm.options.updateInitialValue();
    this.calculationFilterForm.options.resetModel();

    this.filterCalculationItems({
      search: StringUtils.coerceString(this.calculationSearchForm?.model?.search),
    });
  }

  public onCalculationSortChange($event: Sort): void {
    this.filterCalculationItems({ skip: 0, orderBy: $event.active, orderDirection: $event.direction });
  }

  public onCalculationPageChange($event: PageEvent): void {
    this.filterCalculationItems({ skip: $event.pageSize * $event.pageIndex, take: $event.pageSize });
  }

  public onCalculationRowClicked(row: CalculationPresentation): void {
    if (!row) {
      return;
    }
    if (this.selectedCalculationId === row.id) {
      // unselect
      this.resetSelection();
      return;
    }

    this.selectedCalculationId = row.id;
    this.processStateFacadeService.selectingCalculationStarted({ calculationId: this.selectedCalculationId });
  }

  public resetSelection(): void {
    this.processStateFacadeService.resettingSelectionSubmitted();
  }

  private resetSearchAndFilterForms(): void {
    this.calculationSearchForm.form.reset(undefined, { emitEvent: false });
    this.calculationFilterForm.form.reset(undefined, { emitEvent: false });
    this.calculationFilterSource = {};
  }

  private filterCalculationItems(listInformation?: Partial<IcalcListInformation>): void {
    const calculationListFilter: Partial<IcalcMetaDataFilter> = {
      calculationFactor: ObjectUtils.isNullIfNotANumber(this.calculationFilterSource?.calculationFactor),
      customerType: this.calculationFilterSource.customerType ?? null,
    };
    const calculationListOperands: IcalcCalculationOperands = {};

    if (calculationListFilter.calculationFactor) {
      calculationListOperands.calculationFactorOperand = this.calculationFilterSource.calculationFactorOperand;
    }

    ObjectUtils.removeNullProperties(calculationListFilter);
    ObjectUtils.removeNullProperties(calculationListOperands);

    this.searchStateFacadeService.filteringCalculationsSubmitted({
      calculationListFilter,
      calculationListOperands,
      listInformation: listInformation ?? null,
    });
  }
}
