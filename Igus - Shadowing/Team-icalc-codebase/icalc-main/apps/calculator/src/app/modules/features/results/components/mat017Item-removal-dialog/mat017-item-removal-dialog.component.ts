import type { OnDestroy, OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Mat017ItemFormControlName } from '../results/mat017-Item-form-control-name';
import { diff } from 'deep-object-diff';
import { FormControl, FormGroup } from '@angular/forms';
import { ArrayUtils, Mat017ItemStatus } from '@igus/icalc-domain';
import type { RemovedMat017ItemFormModel, ConfigurationWithMat017ItemsChanges } from '@igus/icalc-domain';
import type { Observable } from 'rxjs';
import { Subscription, pairwise, startWith, tap } from 'rxjs';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-mat017-item-removal-dialog',
  templateUrl: './mat017-item-removal-dialog.component.html',
  styleUrls: ['./mat017-item-removal-dialog.component.scss'],
})
export class Mat017ItemRemovalDialogComponent implements OnInit, OnDestroy {
  public mat017ItemRemovalByMat017ItemNumberForm: FormGroup<Record<string, FormControl<boolean>>> = new FormGroup({});
  public mat017ItemListWithNoPrices$: Observable<ConfigurationWithMat017ItemsChanges[]>;
  public enableItemRemovalButton = false;
  public inactive = Mat017ItemStatus.inactive;
  public removed = Mat017ItemStatus.removed;
  public mat017ItemsLatestModificationDate$: Observable<Date>;

  private subscription = new Subscription();

  constructor(private processStateFacadeService: ProcessStateFacadeService) {}

  public ngOnInit(): void {
    this.mat017ItemListWithNoPrices$ = this.processStateFacadeService.mat017ItemListWithNoPrices$.pipe(
      tap((configurations) => {
        configurations.forEach((configurationWithMat017ItemChanges) => {
          configurationWithMat017ItemChanges.mat017ItemsChanges.forEach((mat017Item) => {
            const uniqueMat017ItemNumber = this.createUniqueMat017ItemMatNumber(
              mat017Item.matNumber,
              configurationWithMat017ItemChanges.matNumber
            );

            this.mat017ItemRemovalByMat017ItemNumberForm.setControl(uniqueMat017ItemNumber, new FormControl(false), {
              emitEvent: false,
            });
          });
        });

        this.subscription.add(
          this.mat017ItemRemovalByMat017ItemNumberForm.valueChanges
            .pipe(startWith(this.mat017ItemRemovalByMat017ItemNumberForm.value), pairwise())
            .subscribe(([prev, curr]) => {
              this.updateCheckboxesOfAllRelatedMat017ItemInConfiguration(prev, curr);

              this.enableItemRemovalButton = ArrayUtils.hasTruthyValues(Object.values(curr));
            })
        );
      })
    );
    this.mat017ItemsLatestModificationDate$ = this.processStateFacadeService.mat017ItemsLatestModificationDate$;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public createUniqueMat017ItemMatNumber(mat017ItemMatNumber: string, configurationMatNumber: string): string {
    return Mat017ItemFormControlName.fromValues(mat017ItemMatNumber, configurationMatNumber).getName();
  }

  public updateCheckboxesOfAllRelatedMat017ItemInConfiguration(
    prev: Record<string, boolean>,
    curr: Record<string, boolean>
  ): void {
    const change = diff(prev, curr);
    const [key, value] = Object.entries(change)[0];

    if (value) {
      const changedMat017ItemMatNumber = Mat017ItemFormControlName.fromString(key).mat017ItemMatNumber;
      const updatedValue = Object.keys(curr).reduce((acc, next) => {
        if (next.startsWith(changedMat017ItemMatNumber)) {
          acc[next] = true;
        }
        return acc;
      }, curr);

      this.mat017ItemRemovalByMat017ItemNumberForm.setValue(updatedValue, { emitEvent: false });
    }
  }

  public onRemoveMat017Items(): void {
    const formValue: Record<string, boolean> = this.mat017ItemRemovalByMat017ItemNumberForm.value;
    const selectedMatNumbers: RemovedMat017ItemFormModel[] = Object.keys(formValue)
      .filter((key) => formValue[key])
      .map((matNumber) => {
        const { mat017ItemMatNumber, configurationMatNumber } = Mat017ItemFormControlName.fromString(matNumber);

        return {
          configurationMatNumber,
          matNumber: mat017ItemMatNumber,
        };
      });

    this.processStateFacadeService.removingMat017ItemFromConfigurationsSubmitted(selectedMatNumbers);
  }
}
