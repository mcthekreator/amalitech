import type { OnDestroy, OnInit } from '@angular/core';
import {
  Component,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import type { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import type { Sort, SortDirection } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { NavigationStart, Router } from '@angular/router';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { IcalcStep } from '@icalc/frontend/app/modules/core/state/app-state/app-state.model';
import { ChainflexStateFacadeService } from '@icalc/frontend/app/modules/core/state/chainflex-state/chainflex-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { IcalcErrorStateMatcher } from '@icalc/frontend/app/modules/shared/services/form.utils';
import type {
  ChainflexCable,
  IcalcListInformation,
  SingleCableCalculationPriceUpdateReference,
} from '@igus/icalc-domain';
import { ObjectUtils } from '@igus/icalc-domain';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { combineLatest, map, debounceTime, distinctUntilChanged, filter, Subject, Subscription, take } from 'rxjs';
import type { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-chainflex',
  templateUrl: './chainflex.component.html',
  styleUrls: ['./chainflex.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ChainflexComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort)
  public sort: MatSort;

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;

  @ViewChild('chainflexRemovalWarningDialog', { static: true })
  public chainflexRemovalWarningDialog: TemplateRef<unknown>;

  public priceUpdateReference$: Observable<SingleCableCalculationPriceUpdateReference>;
  public chainflexInputSubject$ = new Subject<string>();
  public subscription = new Subscription();
  public form = new FormGroup({});
  public model: { searchString?: string } = {};
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [
    {
      key: 'searchString',
      type: 'input',
      props: {
        addonRight: {
          icon: 'search',
        },
        label: 'icalc.chainflex.SEARCH-PROMPT',
        placeholder: 'icalc.chainflex.SEARCH-PROMPT',
        translate: true,
        appearance: 'outline',
        required: false,
        attributes: { dataCy: 'search-string-input' },
        keyup: (field, event): void => {
          this.chainflexInputSubject$.next(event.target.value);
        },
      },
    },
  ];

  public lengthPattern = '^[0-9]{1,5}([.,][0-9]{1,2})?$';
  public chainflexLength = new FormControl('', {
    validators: [
      Validators.required,
      Validators.min(0.01),
      Validators.max(10000.0),
      Validators.pattern(this.lengthPattern),
    ],
  });

  public matcher = new IcalcErrorStateMatcher();
  public chainflexIsLoading$: Observable<boolean>;
  public chainflexItems$: Observable<ChainflexCable[]>;
  public chainflexError$: Observable<string>;
  public isLocked$: Observable<boolean>;
  public noItemsFound$: Observable<boolean>;
  public isFormReady = false;
  public initialChosenChainflexCableId: string = null;
  public initialChosenChainflexCableLength: number = null;
  public chosenChainflexCable: ChainflexCable = null;
  public chosenChainflexCable$: Observable<ChainflexCable>;
  public isLocked: boolean;
  public chainflexPricesHaveChanged$: Observable<boolean>;
  public chainflexesAndPricesAvailable$: Observable<boolean>;

  /*
   * When the selected chainflexCable from configuration state is not available anymore
   * the user should be warned before choosing a new one.
   */
  public warnUserBeforeChangingChainflexCable: boolean;
  public showNewPriceInfoBox$: Observable<boolean>;
  public showNoPriceInfoBox$: Observable<boolean>;

  public hasSearchValue = false;
  public columnsToDisplay = [
    'image',
    'partNumber', // Art.-Nr.
    'description', // chainflex ® Leitung
    'outerJacket', // Mantel
    'overallShield', // Schirm
    'numberOfCores', // Aderzahl
    'nominalCrossSection', // mm²
    'outerDiameter', // Außendurchmesser (d) max. [mm]
    'cableStructure', // Aderzahl und Leiternennquerschnitt [mm²]
    'ul', // UL (Style?)
    'price',
  ];

  // STEPPER
  public nextStep$: Observable<IcalcStep>;
  public previousStep$: Observable<IcalcStep>;
  public sortActive: string;
  public sortDirection: SortDirection = 'asc';
  public totalCount$: Observable<number>;
  public listInformation$: Observable<IcalcListInformation>;

  constructor(
    private appStateFacadeService: AppStateFacadeService,
    private processStateFacadeService: ProcessStateFacadeService,
    private chainflexStateFacadeService: ChainflexStateFacadeService,
    private router: Router,
    private cfRemovalWarningDialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.chainflexStateFacadeService.enteringChainflexPageStarted();
  }

  public ngOnInit(): void {
    this.listInformation$ = this.chainflexStateFacadeService.listInformation$;

    this.subscription.add(
      this.listInformation$.subscribe((value) => {
        this.sortActive = value.orderBy;
        this.sortDirection = value.orderDirection;
        this.model = value.search ? { ...{ searchString: value.search } } : {};
        this.isFormReady = true;
      })
    );
    this.resetChainflexItems();

    this.totalCount$ = this.chainflexStateFacadeService.totalCount$;
    this.nextStep$ = this.appStateFacadeService.nextStep$;
    this.previousStep$ = this.appStateFacadeService.previousStep$;
    this.chainflexIsLoading$ = this.chainflexStateFacadeService.chainflexIsLoading$;
    this.noItemsFound$ = this.chainflexStateFacadeService.noItemsFound$;
    this.chainflexItems$ = this.chainflexStateFacadeService.chainflexItems$;
    this.chosenChainflexCable$ = this.chainflexStateFacadeService.chainflexCable$;
    this.chainflexPricesHaveChanged$ = this.chainflexStateFacadeService.chainflexPricesHaveChanged$;
    this.chainflexesAndPricesAvailable$ = this.chainflexStateFacadeService.chainflexesAndPricesAvailable$;
    this.priceUpdateReference$ = this.chainflexStateFacadeService.priceUpdateReference$;

    this.processStateFacadeService.chainflexCableLength$.pipe(take(1)).subscribe((chainflexLength) => {
      this.initialChosenChainflexCableLength = chainflexLength;
      this.chainflexLength.setValue(`${chainflexLength}`);
    });

    const chainFlexStatesSource$ = combineLatest([
      this.processStateFacadeService.selectedConfigurationData$.pipe(
        map((configuration) => configuration?.state?.chainFlexState)
      ),
      this.chosenChainflexCable$,
    ]);

    this.subscription.add(
      chainFlexStatesSource$.subscribe(([chainFlexStateFromSelectedConfiguration, chosenChainflexCable]) => {
        this.chosenChainflexCable =
          chosenChainflexCable || chainFlexStateFromSelectedConfiguration?.chainflexCable || null;
      })
    );

    this.chainflexError$ = this.chainflexStateFacadeService.chainflexError$;
    this.chainflexInputSubject$.pipe(debounceTime(450), distinctUntilChanged()).subscribe((searchValue) => {
      this.hasSearchValue = !!searchValue;
      this.chainflexStateFacadeService.searchingChainflexStarted({ search: searchValue, skip: 0 });
    });
    this.isLocked$ = this.processStateFacadeService.isLocked$;
    this.isLocked$.pipe(take(1)).subscribe((value) => {
      if (value) {
        this.chainflexLength.disable();
      }
      this.isLocked = value;
    });

    this.subscription.add(
      this.processStateFacadeService.selectedConfigurationData$
        .pipe(
          filter((value) => !!value),
          take(1)
        )
        .subscribe((configurationData) => {
          const cfCable = configurationData.state.chainFlexState?.chainflexCable;

          this.chainflexStateFacadeService.enteringChainflexPageEntered(cfCable);
        })
    );

    this.subscription.add(
      this.chainflexesAndPricesAvailable$.subscribe((value) => {
        this.warnUserBeforeChangingChainflexCable = !value;
      })
    );

    this.showNewPriceInfoBox$ = combineLatest([
      this.isLocked$,
      this.chainflexesAndPricesAvailable$,
      this.chainflexPricesHaveChanged$,
      this.priceUpdateReference$,
      this.chosenChainflexCable$,
    ]).pipe(
      map(
        ([
          isLocked,
          chainflexesAndPricesAvailable,
          chainflexPricesHaveChanged,
          priceUpdateReference,
          chosenChainflexCable,
        ]) => {
          return (
            isLocked !== true &&
            chainflexesAndPricesAvailable &&
            chainflexPricesHaveChanged &&
            priceUpdateReference?.partNumber === chosenChainflexCable?.partNumber
          );
        }
      )
    );

    this.showNoPriceInfoBox$ = combineLatest([
      this.isLocked$,
      this.chainflexesAndPricesAvailable$,
      this.priceUpdateReference$,
      this.chosenChainflexCable$,
    ]).pipe(
      map(([isLocked, chainflexesAndPricesAvailable, priceUpdateReference, chosenChainflexCable]) => {
        return (
          isLocked !== true &&
          chainflexesAndPricesAvailable === false &&
          priceUpdateReference?.partNumber === chosenChainflexCable?.partNumber
        );
      })
    );

    /*
     * Save current user input before leaving the page.
     * Can't be handled in ngOnDestroy as it will be blocked by the RequiredDataGuard for the freshly created calculation.
     */

    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe(() => this.onStartLeavingPage())
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onRowClicked(row: ChainflexCable): void {
    if (this.warnUserBeforeChangingChainflexCable) {
      this.openCFRemovalWarningDialog(row);
      return;
    }

    if (row.partNumber === this.chosenChainflexCable?.partNumber) {
      return;
    }

    this.chainflexStateFacadeService.chainflexCableChosen(row);
    this.chosenChainflexCable = ObjectUtils.cloneDeep(row);
  }

  public resetChosenChainflex(): void {
    this.chainflexStateFacadeService.chainflexCableReset();
  }

  public sortChange($event: Sort): void {
    this.chainflexStateFacadeService.searchingChainflexStarted({
      skip: 0,
      orderBy: $event.active,
      orderDirection: $event.direction,
    });
  }

  public onPageChange($event: PageEvent): void {
    this.chainflexStateFacadeService.searchingChainflexStarted({
      skip: $event.pageSize * $event.pageIndex,
      take: $event.pageSize,
    });
  }

  public onRemoveOutdatedCFConfirmed(row: ChainflexCable): void {
    this.chainflexStateFacadeService.chainflexCableChosen(row);
    this.cdr.detectChanges();
  }

  private openCFRemovalWarningDialog(row: ChainflexCable): void {
    this.cfRemovalWarningDialog.open(this.chainflexRemovalWarningDialog, {
      id: 'removeChainflexCablesDialog',
      maxWidth: 900,
      data: { row },
    });
  }

  private onStartLeavingPage(): void {
    this.chainflexStateFacadeService.leavingChainflexPageStarted(
      +this.chainflexLength.value,
      this.chosenChainflexCable
    );
  }

  private resetChainflexItems(): void {
    this.chainflexStateFacadeService.setDefaultListInformation();
    this.chainflexStateFacadeService.searchingChainflexStarted({});
  }
}
