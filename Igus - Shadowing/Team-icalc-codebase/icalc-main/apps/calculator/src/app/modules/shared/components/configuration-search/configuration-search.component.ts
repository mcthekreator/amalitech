import type { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Input, ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { PageEvent } from '@angular/material/paginator';
import type { Sort, SortDirection } from '@angular/material/sort';
import type { SelectedConfigurationRow } from '@icalc/frontend/app/modules/core/state/process-state/process-state.model';
import type {
  ConfigurationPresentation,
  ConfigurationSearchResult,
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
import { SearchStateFacadeService } from '../../../core/state/search-state/search-state-facade.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-configuration-search',
  templateUrl: './configuration-search.component.html',
  styleUrls: ['./configuration-search.component.scss'],
})
export class ConfigurationSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public selectedIndexChange$: Observable<number>;
  @Input() public filterConfigurations?: boolean; // this flag is used to trigger filtering of configurations in the config search dialog
  @Input() public selectedConfigurationId: string = null;
  @Output() public readonly resetSelectionEvent = new EventEmitter<unknown>();
  @Output() public readonly configurationSelected = new EventEmitter<SelectedConfigurationRow>();

  public configurationItems$: Observable<ConfigurationSearchResult[]>;
  public configurationListInformation$: Observable<IcalcListInformation>;
  public configurationSearchInitiated = false;
  public configurationSearchError$: Observable<IcalcHTTPError>;
  public configurationFilterSource: Partial<IcalcMetaDataFilter & IcalcCalculationOperands> = {};
  public configurationTotalCount$: Observable<number>;
  public isLoadingConfigurationItems$: Observable<boolean>;
  public noConfigurationItemsFound$: Observable<boolean>;
  public configurationSortActive: string;
  public configurationSortDirection: SortDirection = 'asc';

  public configurationFilterForm: FormlyFormSettings<Partial<IcalcMetaData & IcalcCalculationOperands>> = {
    form: new FormGroup({}),
    model: {},
    options: {} as FormlyFormOptions,
    fields: [
      {
        fieldGroupClassName: 'horizontal-display-flex-size-form-elements gap-30',
        fieldGroup: [
          {
            key: 'labeling',
            type: 'input',
            className: 'grow-1',
            props: {
              label: 'icalc.meta_data.LABELING',
              placeholder: 'icalc.meta_data.LABELING',
              attributes: {
                dataCy: 'assign-labeling-filter',
              },
              translate: true,
              appearance: 'outline',
            },
          },
        ],
      },
    ] as FormlyFieldConfig[],
  };

  public configurationSearchForm: FormlyFormSettings<Partial<{ searchConfiguration: string }>> = {
    form: new FormGroup({}),
    model: {},
    options: {} as FormlyFormOptions,
    fields: [
      {
        key: 'searchConfiguration',
        type: 'input',
        props: {
          addonRight: {
            icon: 'search',
          },
          label: 'icalc.meta_data.SEARCH-MAT-NUMBER',
          placeholder: 'icalc.meta_data.SEARCH-MAT-NUMBER',
          translate: true,
          appearance: 'outline',
          required: false,
          attributes: {
            dataCy: 'configurationSearchFormInput',
          },
        },
      },
    ] as FormlyFieldConfig[],
  };

  public columnsToDisplay = [
    'matNumber',
    'calculationNumbers',
    'partNumber',
    'labelingLeft',
    'labelingRight',
    'creationDate',
    'createdBy',
    'modificationDate',
    'modifiedBy',
  ];

  private subscription = new Subscription();

  constructor(private searchStateFacadeService: SearchStateFacadeService) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.selectedIndexChange$?.subscribe((value) => {
        if (value === 2) {
          this.filterConfigurationItems();
        } else {
          this.resetSearchAndFilterForms();
        }
      })
    );

    this.subscription.add(
      this.searchStateFacadeService.configurationListInformation$.subscribe((value) => {
        this.configurationSortActive = value.orderBy;
        this.configurationSortDirection = value.orderDirection;
      })
    );

    this.configurationSearchInitiated = true;
    this.configurationItems$ = this.searchStateFacadeService.configurationItems$;
    this.configurationListInformation$ = this.searchStateFacadeService.configurationListInformation$;
    this.configurationTotalCount$ = this.searchStateFacadeService.configurationTotalCount$;
    this.configurationSearchError$ = this.searchStateFacadeService.configurationSearchError$;
    this.noConfigurationItemsFound$ = this.searchStateFacadeService.noConfigurationItemsFound$;
    this.isLoadingConfigurationItems$ = this.searchStateFacadeService.isLoadingConfigurationItems$;
  }

  public ngAfterViewInit(): void {
    this.subscription.add(
      this.configurationSearchForm.form
        .get('searchConfiguration')
        .valueChanges.pipe(debounceTime(450), distinctUntilChanged())
        .subscribe((value) => {
          this.filterConfigurationItems({ search: value, skip: 0 });
        })
    );

    // this is a work around to avoid timing issues, for more information see:
    // https://indepth.dev/posts/1001/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error#asynchronous-update
    setTimeout(() => {
      if (this.filterConfigurations) {
        this.filterConfigurationItems();
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onApplyConfigurationFilter(): void {
    this.configurationFilterSource = ObjectUtils.cloneDeep<Partial<IcalcMetaData & IcalcCalculationOperands>>(
      this.configurationFilterForm.model
    );
    this.filterConfigurationItems({
      search: StringUtils.coerceString(this.configurationSearchForm?.model?.searchConfiguration),
    });
  }

  public onRemoveConfigurationFilter(filterPropertyName: string): void {
    if (!filterPropertyName || !this.configurationFilterSource[filterPropertyName]) {
      return;
    }
    delete this.configurationFilterSource[filterPropertyName];
    this.configurationFilterForm.model = ObjectUtils.cloneDeep<Partial<IcalcMetaData & IcalcCalculationOperands>>(
      this.configurationFilterSource
    );

    this.configurationFilterForm.options.updateInitialValue();
    this.configurationFilterForm.options.resetModel();

    this.filterConfigurationItems({
      search: StringUtils.coerceString(this.configurationSearchForm?.model?.searchConfiguration),
    });
  }

  public onConfigurationSortChange($event: Sort): void {
    this.filterConfigurationItems({ skip: 0, orderBy: $event.active, orderDirection: $event.direction });
  }

  public onConfigurationPageChange($event: PageEvent): void {
    this.filterConfigurationItems({ skip: $event.pageSize * $event.pageIndex, take: $event.pageSize });
  }

  public onConfigurationRowClicked(row: ConfigurationPresentation): void {
    if (this.selectedConfigurationId === row.id) {
      // unselect
      this.resetSelection();
      return;
    }

    this.selectedConfigurationId = row.id;
    this.configurationSelected.emit({
      id: row.id,
      matNumber: row.matNumber,
      labelingLeft: row.labelingLeft,
      labelingRight: row.labelingRight,
      description: row.description,
    });
  }

  public resetSelection(): void {
    this.resetSelectionEvent.emit();
  }

  private resetSearchAndFilterForms(): void {
    this.configurationSearchForm.form.reset(undefined, { emitEvent: false });
    this.configurationFilterForm.form.reset(undefined, { emitEvent: false });
    this.configurationFilterSource = {};
  }

  private filterConfigurationItems(listInformation?: Partial<IcalcListInformation>): void {
    const configurationListFilter: Partial<IcalcMetaDataFilter> = {
      batchSize: ObjectUtils.isNullIfNotANumber(this.configurationFilterSource?.batchSize),
      labeling: this.configurationFilterSource.labeling ?? null,
    };
    const configurationListOperands: IcalcCalculationOperands = {};

    ObjectUtils.removeNullProperties(configurationListFilter);
    ObjectUtils.removeNullProperties(configurationListOperands);

    this.searchStateFacadeService.filteringConfigurationsSubmitted({
      configurationListFilter,
      configurationListOperands,
      listInformation: listInformation ?? null,
    });
  }
}
