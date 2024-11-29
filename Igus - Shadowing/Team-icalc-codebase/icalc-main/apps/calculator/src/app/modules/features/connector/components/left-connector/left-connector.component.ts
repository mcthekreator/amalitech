import type { OnDestroy, OnInit } from '@angular/core';
import { Component, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { IcalcStep } from '@icalc/frontend/app/modules/core/state/app-state/app-state.model';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import type {
  ChainflexCable,
  Favorites,
  FavoritesToMat017Item,
  FormlyFormSettings,
  IcalcListInformation,
  LocalizedStrings,
  Mat017ItemWithWidenData,
  OneSideOfConfigurationConnectorPresentation,
} from '@igus/icalc-domain';
import { ConnectorActionButtonsAction, Mat017ItemMappers, Mat017ItemStatus } from '@igus/icalc-domain';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import type { Observable } from 'rxjs';
import { combineLatest, filter, firstValueFrom, map, Subject, Subscription, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import type { MatSelectChange } from '@angular/material/select';
import { ConnectorActionButtonsFormGeneratorService } from '@icalc/frontend/app/modules/shared/form-generators/connector-action-buttons-form.service';
import { NavigationStart, Router } from '@angular/router';
import { ConnectorItemPriceMismatchModalService } from '@icalc/frontend/app/modules/shared/components/connector-items-price-mismatch-dialog/connector-item-price-mismatch-modal/connector-item-price-mismatch-modal.service';
import { CreateMat017ItemsDialogService } from '@icalc/frontend/app/modules/shared/components/create-mat017-items';
import { WarningDialogService } from '@icalc/frontend/app/modules/shared/components/warning-dialog/warning-dialog.service';
import { Mat017ItemFavoritesService } from '../mat017-item-favorites/mat017-item-favorites.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-left-connector',
  templateUrl: './left-connector.component.html',
  styleUrls: ['./left-connector.component.scss'],
})
export class LeftConnectorComponent implements OnInit, OnDestroy {
  @ViewChild('confirmCopyConnectorDialogLeft', { static: true })
  public confirmCopyConnectorDialogLeft: TemplateRef<unknown>;

  @ViewChild('confirmFavoritesDialog', { static: true }) public confirmFavoritesDialog: TemplateRef<unknown>;

  @ViewChild(MatAccordion) public accordion: MatAccordion;

  public nextStep$: Observable<IcalcStep>;
  public previousStep$: Observable<IcalcStep>;
  public chainflexCable$: Observable<ChainflexCable>;
  public chainflexCableStructure$: Observable<LocalizedStrings>;

  public isLocked: boolean;
  public isLocked$: Observable<boolean>;
  public subscription = new Subscription();
  public isLoading$: Observable<boolean>;
  public addedMat017Items$: Observable<{ [id: string]: number }>;
  public listInformation$: Observable<IcalcListInformation>;
  public mat017ItemListWithWidenDataCount$: Observable<number>;
  public mat017ItemListWithWidenData$: Observable<Mat017ItemWithWidenData[]>;
  public quantitySubject$: Subject<{ amount: number; matNumber: string }> = new Subject();

  public favorites$: Observable<Favorites[]>;
  public displayedColumns: string[] = [
    'select',
    'matNumber',
    'itemDescription1',
    'itemDescription2',
    'mat017ItemGroup',
    'amount',
  ];

  public favoritesIsLoading$: Observable<boolean>;

  public footerActionButtons: FormlyFormSettings<{ selectedAction: string }> =
    this.connectorActionButtonsFormGeneratorService.initializeForm();

  constructor(
    private appStateFacadeService: AppStateFacadeService,
    private processStateFacadeService: ProcessStateFacadeService,
    private connectorStateFacadeService: ConnectorStateFacadeService,
    private copyConnectorDialog: MatDialog,
    private favoritesDialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private connectorActionButtonsFormGeneratorService: ConnectorActionButtonsFormGeneratorService,
    private connectorItemPriceMismatchModalService: ConnectorItemPriceMismatchModalService,
    private createMat017ItemsDialogService: CreateMat017ItemsDialogService,
    private warningDialogService: WarningDialogService,
    private mat017ItemFavoritesService: Mat017ItemFavoritesService
  ) {
    this.generateFooterActionButtonsForm();
  }

  public ngOnInit(): void {
    this.connectorStateFacadeService.enteringLeftConnectorPageStarted();
    combineLatest([
      this.processStateFacadeService.selectedConfigurationData$,
      this.processStateFacadeService.isSavingSingleCableCalculation$,
    ])
      .pipe(
        filter(([_, isSavingSingleCableCalculation]) => !isSavingSingleCableCalculation),
        take(1)
      )
      .subscribe(([selectedConfigurationData, _]) => {
        this.connectorStateFacadeService.enteringLeftConnectorPageEntered({
          leftConnector: selectedConfigurationData.state.connectorState?.leftConnector || null,
        });
      });

    this.isLoading$ = this.connectorStateFacadeService.leftConnector$.pipe(
      map((leftConnector) => leftConnector?.isLoading)
    );
    this.addedMat017Items$ = this.connectorStateFacadeService.leftConnector$.pipe(
      map((leftConnector) => leftConnector?.addedMat017Items)
    );
    this.listInformation$ = this.connectorStateFacadeService.leftListInformation$;
    this.chainflexCable$ = this.processStateFacadeService.chainflexCable$;
    this.chainflexCableStructure$ = this.processStateFacadeService.chainflexCableStructure$;

    this.favorites$ = this.connectorStateFacadeService.leftFavorites$;
    this.favoritesIsLoading$ = this.connectorStateFacadeService.leftFavoritesIsLoading$;

    this.nextStep$ = this.appStateFacadeService.nextStep$;
    this.previousStep$ = this.appStateFacadeService.previousStep$;
    this.mat017ItemListWithWidenDataCount$ = this.appStateFacadeService.currentStep$.pipe(
      filter((value) => !!value),
      switchMap((value) => {
        if (value.label === 'connector-left') {
          return this.connectorStateFacadeService.leftItemList$;
        }
        return this.connectorStateFacadeService.rightItemList$;
      }),
      map((value) => {
        return value?.length || 0;
      })
    );
    this.mat017ItemListWithWidenData$ = this.connectorStateFacadeService
      .getConnectorSelector('leftConnector')
      .pipe(map((leftConnector) => leftConnector?.mat017ItemListWithWidenData));

    this.subscription.add(
      this.quantitySubject$.pipe(map((value) => ({ ...value, amount: +value.amount }))).subscribe((value) => {
        this.connectorStateFacadeService.changeQuantityOfMat017ItemWithWidenData({ ...value, which: 'leftConnector' });
      })
    );
    this.isLocked$ = this.processStateFacadeService.isLocked$;
    this.isLocked$.pipe(take(1)).subscribe((value) => {
      this.isLocked = value;
    });

    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe(() => this.dispatchPageLeavingEvent())
    );
  }

  public openCopyConnectorDialogWithoutRef(): void {
    this.copyConnectorDialog.open(this.confirmCopyConnectorDialogLeft, { id: 'confirmCopyConnectorDialogLeft' });
  }

  public copyConnector(): void {
    this.connectorStateFacadeService.cloneLeftConnectorMat017ItemListWithWidenData({
      which: 'leftConnector',
      data: this.createLeftConnectorPayload(),
    });
    this.copyConnectorDialog.getDialogById('confirmCopyConnectorDialogLeft').close();
  }

  public async openFavoritesDialog(): Promise<void> {
    const favorites: FavoritesToMat017Item[] = await firstValueFrom(
      this.mat017ItemFavoritesService.open('leftConnector')
    );

    this.onAddFavoritesToMat017ItemWithWidenDataList(favorites);
  }

  public openRemoveInvalidMat017ItemDialog(mat017ItemWithWidenData: Mat017ItemWithWidenData): void {
    const dialogData = {
      header: 'icalc.connector-mat017-items-table.INVALID_ITEM_REMOVAL_WARNING_HEADER',
      message: 'icalc.connector-mat017-items-table.INVALID_ITEM_REMOVAL_WARNING',
    };

    this.subscription.add(
      this.warningDialogService
        .open(dialogData)
        .pipe(take(1))
        .subscribe((result) => {
          if (result.isConfirmed) {
            this.removeFromMat017ItemListWithWidenData(mat017ItemWithWidenData);
          }
        })
    );
  }

  public onRemoveFromMat017ItemListWithWidenData(mat017ItemWithWidenData: Mat017ItemWithWidenData): void {
    const itemIsInvalid = mat017ItemWithWidenData?.itemStatus !== Mat017ItemStatus.active;

    if (itemIsInvalid) {
      this.openRemoveInvalidMat017ItemDialog(mat017ItemWithWidenData);
    } else {
      this.removeFromMat017ItemListWithWidenData(mat017ItemWithWidenData);
    }
  }

  public removeFromMat017ItemListWithWidenData(mat017ItemWithWidenData: Mat017ItemWithWidenData): void {
    this.connectorStateFacadeService.removeFromMat017ItemListWithWidenData({
      which: 'leftConnector',
      mat017ItemWithWidenData,
    });
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      which: 'leftConnector',
      listInformation: { skip: 0 },
    });
  }

  public onAddFavoritesToMat017ItemWithWidenDataList(favorites: FavoritesToMat017Item[]): void {
    this.connectorItemPriceMismatchModalService
      .arePricesOnBothSidesConsistentOrIsMismatchCorrected('leftConnector', favorites)
      .then((addItems) => {
        if (addItems) {
          this.addFavoritesToMat017ItemWithWidenDataList(favorites);
        }
      });
  }

  public addFavoritesToMat017ItemWithWidenDataList(favoritesToMat017Items: FavoritesToMat017Item[]): void {
    const mat017ItemsWithWidenData: Mat017ItemWithWidenData[] = [];

    favoritesToMat017Items.forEach((favoritesToMat017Item) => {
      const { mat017Item, amount } = favoritesToMat017Item;
      const mat017ItemWithWidenData: Mat017ItemWithWidenData =
        Mat017ItemMappers.fromMat017ItemToMat017ItemWithWidenData(mat017Item, amount, 'left');

      mat017ItemsWithWidenData.push(mat017ItemWithWidenData);
    });
    this.connectorStateFacadeService.addToMat017ItemListWithWidenData({
      which: 'leftConnector',
      mat017ItemsWithWidenData,
    });
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      which: 'leftConnector',
      listInformation: { skip: 0 },
    });
    this.copyConnectorDialog?.getDialogById('confirmFavoritesDialog')?.close();
  }

  public checkValue(event): void {
    event.target.value = event.target.value.replace(/[^0-9+]/g, '');
  }

  public displayFractionedValue(itemQuantity: number): number | string {
    return this.translate.currentLang === 'de' ? itemQuantity.toLocaleString('de') : itemQuantity;
  }

  public fractionedValueChanged(event, matNumber: string): void {
    const newValue = parseFloat(event?.target?.value.replace(',', '.'));

    this.quantitySubject$.next({ amount: newValue, matNumber });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onCreateMat017Items(): void {
    this.createMat017ItemsDialogService.start('leftConnector');
  }

  private dispatchPageLeavingEvent(): void {
    this.connectorStateFacadeService.leavingLeftConnectorPageStarted({
      leftConnector: this.createLeftConnectorPayload(),
    });
  }

  private createLeftConnectorPayload(): OneSideOfConfigurationConnectorPresentation {
    const leftConnectorState = this.connectorStateFacadeService.leftConnectorSnapshot();

    return {
      addedMat017Items: leftConnectorState.addedMat017Items,
      mat017ItemListWithWidenData: leftConnectorState.mat017ItemListWithWidenData,
    };
  }

  private generateFooterActionButtonsForm(): void {
    const isDisabled$ = this.processStateFacadeService.isLocked$;

    this.footerActionButtons.fields = [
      ...this.connectorActionButtonsFormGeneratorService.generateFields(
        isDisabled$,
        this.onConnectorActionButtonsChanged.bind(this)
      ),
    ];
  }

  private onConnectorActionButtonsChanged(_: FormlyFieldConfig, event?: MatSelectChange): void {
    switch (event.value) {
      case ConnectorActionButtonsAction.selectConnectorSets:
        this.openFavoritesDialog();
        break;
      case ConnectorActionButtonsAction.copyData:
        this.openCopyConnectorDialogWithoutRef();
        break;
      case ConnectorActionButtonsAction.createMat017Items:
        this.onCreateMat017Items();
        break;
      default:
        return;
    }
    this.footerActionButtons.form.reset({ selectedAction: '' });
  }
}
