import type { OnChanges, SimpleChanges } from '@angular/core';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { Mat017ItemStatus } from '@igus/icalc-domain';
import type { Mat017ItemWithWidenData } from '@igus/icalc-domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-connector-mat017-item-invalid-info',
  templateUrl: './mat017-item-invalid-info.component.html',
  styleUrls: ['./mat017-item-invalid-info.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Mat017ItemInvalidInfoComponent implements OnChanges {
  @Input() public mat017ItemListWithWidenData: Mat017ItemWithWidenData[];
  @Input() public isLocked: boolean;

  public hasInValidMat017Items: boolean;
  public invalidMat017ItemsList: { matNumber: string; itemStatus: Mat017ItemStatus }[] = [];
  public itemStatusRemoved: Mat017ItemStatus = Mat017ItemStatus.removed;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.mat017ItemListWithWidenData) {
      const newMat017ItemWithWidenData = changes.mat017ItemListWithWidenData.currentValue;

      this.hasInValidMat017Items = this.getHasInvalidMat017Items(newMat017ItemWithWidenData);
      if (this.hasInValidMat017Items) {
        this.invalidMat017ItemsList = this.getInvalidMat017Items(newMat017ItemWithWidenData);
      }
    }

    if (changes.isLocked) {
      this.isLocked = !!changes.isLocked.currentValue;
    }
  }

  private getHasInvalidMat017Items(items: Mat017ItemWithWidenData[]): boolean {
    return items.some((item: Mat017ItemWithWidenData) => item.itemStatus !== Mat017ItemStatus.active);
  }

  private getInvalidMat017Items(
    mat017Items: Mat017ItemWithWidenData[]
  ): { matNumber: string; itemStatus: Mat017ItemStatus }[] {
    return mat017Items
      .filter((item) => item.itemStatus !== Mat017ItemStatus.active)
      .map((item) => {
        return {
          matNumber: item.matNumber,
          itemStatus: item.itemStatus,
        };
      });
  }
}
