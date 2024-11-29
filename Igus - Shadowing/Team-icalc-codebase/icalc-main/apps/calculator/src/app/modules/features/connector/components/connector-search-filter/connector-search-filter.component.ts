import type { OnInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ChainflexCable, ConnectorSide } from '@igus/icalc-domain';
import type { Mat017ItemWithWidenData, Mat017ItemListFilter, LocalizedStrings } from '@igus/icalc-domain';
import { debounceTime, distinctUntilChanged, pairwise, Subject, Subscription } from 'rxjs';
import { ConnectorStateFacadeService } from '@icalc/frontend/state/connector-state/connector-state-facade.service';
import {
  FilterForm,
  getFilterForm,
} from '@icalc/frontend/modules/features/connector/components/connector-search-filter/filter-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-connector-search-filter',
  templateUrl: './connector-search-filter.component.html',
  styleUrls: ['./connector-search-filter.component.scss'],
})
export class ConnectorSearchFilterComponent implements OnInit {
  @Input()
  public chainflexCable: ChainflexCable;

  @Input()
  public chainflexCableStructure: LocalizedStrings;

  @Input()
  public mat017ItemListWithWidenData: Mat017ItemWithWidenData[];

  @Input()
  public isLocked: boolean;

  @Input()
  public which: ConnectorSide;

  public searchString: string;
  public filterForm: FilterForm;

  public searchStringSubject$ = new Subject<string>();
  public filterSource: Mat017ItemListFilter = { showZeroMatches: false, showOnlyManuallyCreated: false };

  private subscription = new Subscription();

  constructor(private readonly connectorStateFacadeService: ConnectorStateFacadeService) {}

  public ngOnInit(): void {
    this.filterForm = getFilterForm(this.filterSource);
    this.subscription.add(
      this.searchStringSubject$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchString) => {
        this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
          listInformation: { search: `${searchString}`, skip: 0 },
          which: this.which,
        });
      })
    );
    this.subscription.add(
      this.filterForm.form.valueChanges
        .pipe(pairwise<Mat017ItemListFilter>())
        .subscribe((value) => this.onValueChanges(value))
    );
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      listInformation: this.connectorStateFacadeService.getListInformationSnapshot(this.which),
      which: this.which,
    });
  }

  public onApplyFilter(): void {
    this.filterSource = Object.assign({}, this.filterForm.model);
    this.reloadData();
  }

  public onRemoveFilter(whichFilter: keyof Mat017ItemListFilter): void {
    delete this.filterSource[whichFilter];
    delete this.filterForm.model[whichFilter];
    this.reloadData();
  }

  public onValueChanges([previousFilterState, currentFilterState]: Mat017ItemListFilter[]): void {
    const isShowOnlyManuallyCreatedActivated =
      currentFilterState.showOnlyManuallyCreated &&
      !(
        previousFilterState.showOnlyManuallyCreated ||
        previousFilterState.showZeroMatches ||
        currentFilterState.showZeroMatches
      );

    if (isShowOnlyManuallyCreatedActivated) {
      this.filterForm.form.patchValue({ showZeroMatches: true });
    }
  }

  private reloadData(): void {
    this.filterForm.options.updateInitialValue();
    this.filterForm.options.resetModel();
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      which: this.which,
      filterInformation: this.filterSource,
      listInformation: { skip: 0 },
    });
  }
}
