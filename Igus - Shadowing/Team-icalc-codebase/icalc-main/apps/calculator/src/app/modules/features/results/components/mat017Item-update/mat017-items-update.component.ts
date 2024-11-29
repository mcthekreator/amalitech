import type { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { combineLatest, map } from 'rxjs';
import type { Observable } from 'rxjs';
import type { ConfigurationWithMat017ItemsChanges } from '@igus/icalc-domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-mat017-items-update',
  templateUrl: './mat017-items-update.component.html',
  styleUrls: ['./mat017-items-update.component.scss'],
})
export class Mat017ItemsUpdateComponent implements OnInit {
  @ViewChild('updateMat017ItemPricesDialog', { static: true })
  public updateMat017ItemPricesDialog: TemplateRef<unknown>;

  public mat017ItemListWithNewPrices$: Observable<ConfigurationWithMat017ItemsChanges[]>;
  public hasAnyMat017ItemPriceChanged$: Observable<boolean>;
  public showNewMat017ItemPricesInfo$: Observable<boolean>;
  public isLocked$: Observable<boolean>;
  public mat017ItemsLatestModificationDate$: Observable<Date>;

  constructor(
    private processStateFacadeService: ProcessStateFacadeService,
    private updateMatItemPricesDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.mat017ItemListWithNewPrices$ = this.processStateFacadeService.mat017ItemListWithNewPrices$;
    this.hasAnyMat017ItemPriceChanged$ = this.processStateFacadeService.hasAnyMat017ItemPriceChange$;
    this.isLocked$ = this.processStateFacadeService.isLocked$;

    this.showNewMat017ItemPricesInfo$ = combineLatest([this.isLocked$, this.hasAnyMat017ItemPriceChanged$]).pipe(
      map(([isLocked, mat017ItemPricesHaveChanged]) => {
        return isLocked !== true && mat017ItemPricesHaveChanged;
      })
    );
    this.mat017ItemsLatestModificationDate$ = this.processStateFacadeService.mat017ItemsLatestModificationDate$;
  }

  public openUpdateMat017ItemPricesDialog(): void {
    this.updateMatItemPricesDialog.open(this.updateMat017ItemPricesDialog, {
      id: 'updateMat017ItemPricesDialog',
      minWidth: 1200,
      maxWidth: 1200,
    });
  }

  public onUpdateMat017ItemPrices(): void {
    this.processStateFacadeService.updatingMat017ItemPricesSubmitted();
  }
}
