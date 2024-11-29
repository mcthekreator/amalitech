import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import type { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import type { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import type { IcalcListResponseInformation } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state.model';
import { ConnectorItemPriceMismatchModalService } from '@icalc/frontend/app/modules/shared/components/connector-items-price-mismatch-dialog/connector-item-price-mismatch-modal/connector-item-price-mismatch-modal.service';
import { Mat017ItemStatus, ConnectorSide } from '@igus/icalc-domain';
import type { IcalcListInformation, Mat017ItemWithWidenData } from '@igus/icalc-domain';
import type { Observable } from 'rxjs';
import { firstValueFrom, map, Subscription, take } from 'rxjs';
import { DialogConfirmOrCancelEnum } from '@icalc/frontend/app/modules/shared/types';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { WarningDialogService } from '@icalc/frontend/app/modules/shared/components/warning-dialog/warning-dialog.service';

@Component({
  selector: 'icalc-connector-mat017-items-table',
  templateUrl: './connector-mat017-items-table.component.html',
  styleUrls: ['./connector-mat017-items-table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectorMat017ItemsTableComponent implements OnInit, OnDestroy {
  @Input()
  public whichConnector: ConnectorSide;

  @Input()
  public isLocked: boolean;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  public displayedColumns: string[] = [
    'actions',
    'matNumber',
    'score',
    'itemDescription1',
    'itemDescription2',
    'mat017ItemGroup',
    'supplierItemNumber',
    'price',
    'manuallyCreated',
  ];

  public isLoading$: Observable<boolean>;
  public dataSource$: Observable<MatTableDataSource<Mat017ItemWithWidenData>>;
  public mat017ItemListWithWidenData$: Observable<Mat017ItemWithWidenData[]>;
  public addedMat017Items$: Observable<{ [id: string]: number }>;
  public invalidAddedMat017Items: string[];
  public selectedTab$: Observable<string>;
  public mat017ItemListWithWidenDataElements$: Observable<{ [matNumber: string]: 'left' | 'right' }>;
  public subscription = new Subscription();
  public listInformation$: Observable<IcalcListInformation>;
  public totalCount$: Observable<number>;
  public showQuantity: boolean;
  public listResponseInformation$: Observable<IcalcListResponseInformation>;
  public validMat017ItemStatus = Mat017ItemStatus.active;
  public mat017ItemsLatestModificationDate$: Observable<Date>;
  constructor(
    private connectorStateFacadeService: ConnectorStateFacadeService,
    private connectorItemPriceMismatchModalService: ConnectorItemPriceMismatchModalService,
    private processStateFacadeService: ProcessStateFacadeService,
    private warningDialogService: WarningDialogService
  ) {}

  public ngOnInit(): void {
    const rightOrLeft = this.whichConnector === 'leftConnector' ? 'left' : 'right';

    this.mat017ItemListWithWidenDataElements$ = this.connectorStateFacadeService
      .getConnectorSelector(this.whichConnector)
      .pipe(
        map((connector) => connector?.mat017ItemListWithWidenData),
        map((mat017ItemListWithWidenData) => {
          const mapObject = {};

          mat017ItemListWithWidenData.forEach((item) => (mapObject[item.matNumber] = rightOrLeft));
          return mapObject;
        })
      );

    const which = this.whichConnector === 'leftConnector' ? 'left' : 'right';

    this.totalCount$ = this.connectorStateFacadeService[`${which}TotalCount$`];
    this.listInformation$ = this.connectorStateFacadeService[`${which}ListInformation$`];
    this.listResponseInformation$ = this.connectorStateFacadeService[`${which}ResponseInformation$`];

    this.dataSource$ = this.connectorStateFacadeService.getConnectorSelector(this.whichConnector).pipe(
      map((connector) => connector?.items),
      map((items) => {
        return new MatTableDataSource(items);
      })
    );
    this.mat017ItemListWithWidenData$ = this.connectorStateFacadeService
      .getConnectorSelector(this.whichConnector)
      .pipe(map((connector) => connector?.mat017ItemListWithWidenData));
    this.isLoading$ = this.connectorStateFacadeService
      .getConnectorSelector(this.whichConnector)
      .pipe(map((connector) => connector?.isLoading));
    this.addedMat017Items$ = this.connectorStateFacadeService
      .getConnectorSelector(this.whichConnector)
      .pipe(map((connector) => connector?.addedMat017Items));

    this.mat017ItemsLatestModificationDate$ = this.processStateFacadeService.mat017ItemsLatestModificationDate$;
  }

  public sortChange($event: Sort): void {
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      listInformation: {
        orderBy: $event.active,
        orderDirection: $event.direction,
      },
      which: this.whichConnector,
    });
  }

  public onAddToMat017ItemListWithWidenData(mat017ItemWithWidenData: Mat017ItemWithWidenData): void {
    const hasMismatch = this.connectorItemPriceMismatchModalService.checkMat017ItemPriceMismatchOnOtherConnectorSide(
      this.whichConnector,
      mat017ItemWithWidenData.matNumber
    );

    if (!hasMismatch) {
      return this.addToMat017ItemListWithWidenData(mat017ItemWithWidenData);
    } else {
      firstValueFrom(
        this.connectorItemPriceMismatchModalService.syncMat017ItemPriceAccrossConnectors$(
          this.whichConnector,
          mat017ItemWithWidenData.matNumber
        )
      ).then((response) => {
        if (response === DialogConfirmOrCancelEnum.confirmAction)
          this.addToMat017ItemListWithWidenData(mat017ItemWithWidenData);
      });
    }
  }

  public addToMat017ItemListWithWidenData(mat017ItemWithWidenData: Mat017ItemWithWidenData): void {
    const { amountDividedByPriceUnit, mat017ItemGroup } = mat017ItemWithWidenData;
    const mat017ItemsWithWidenData = [
      {
        ...mat017ItemWithWidenData,
        overrides: {
          amountDividedByPriceUnit,
          mat017ItemGroup,
        },
      },
    ];

    this.connectorStateFacadeService.addToMat017ItemListWithWidenData({
      which: this.whichConnector,
      mat017ItemsWithWidenData,
    });
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      which: this.whichConnector,
      listInformation: { skip: 0 },
    });
  }

  public removeFromMat017ItemListWithWidenData(mat017ItemWithWidenData: Mat017ItemWithWidenData): void {
    this.connectorStateFacadeService.removeFromMat017ItemListWithWidenData({
      which: this.whichConnector,
      mat017ItemWithWidenData,
    });
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      which: this.whichConnector,
      listInformation: { skip: 0 },
    });
  }

  public onRemoveFromMat017ItemListWithWidenData(mat017ItemWithWidenData: Mat017ItemWithWidenData): void {
    this.removeFromMat017ItemListWithWidenData(mat017ItemWithWidenData);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onPageChange($event: PageEvent): void {
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      listInformation: {
        skip: $event.pageSize * $event.pageIndex,
        take: $event.pageSize,
      },
      which: this.whichConnector,
    });
  }

  public openDeleteManuallyCreatedMat017ItemDialog(matNumber: string): void {
    const dialogData = {
      header: 'icalc.connector-mat017-items-table.INVALID_ITEM_REMOVAL_WARNING_HEADER',
      message: 'icalc.connector-mat017-items-table.DELETE_MANUALLY_CREATED_ITEM_WARNING',
    };

    this.subscription.add(
      this.warningDialogService
        .open(dialogData)
        .pipe(take(1))
        .subscribe((result) => {
          if (result.isConfirmed) {
            this.removeManuallyCreatedItem(matNumber);
          }
        })
    );
  }

  private removeManuallyCreatedItem(matNumber: string): void {
    this.connectorStateFacadeService.removeManuallyCreatedMat017Item({ matNumber, which: this.whichConnector });
    this.connectorStateFacadeService.getMat017ItemsOfConnectorWithWidenData({
      which: this.whichConnector,
      listInformation: { skip: 0 },
    });
  }
}
