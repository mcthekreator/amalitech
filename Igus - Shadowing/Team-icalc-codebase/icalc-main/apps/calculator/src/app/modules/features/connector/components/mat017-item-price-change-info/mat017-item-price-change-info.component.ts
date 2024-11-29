// mat017-info.component.ts
import type { OnChanges, SimpleChanges } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Mat017ItemStatus, NumberUtils, type Mat017ItemWithWidenData } from '@igus/icalc-domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-connector-mat017-item-price-change-info',
  templateUrl: './mat017-item-price-change-info.component.html',
  styleUrls: ['./mat017-item-price-change-info.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Mat017ItemPriceChangeInfoComponent implements OnChanges {
  @Input() public isLocked: boolean;
  @Input() public mat017ItemListWithWidenData: Mat017ItemWithWidenData[];

  public hasMat017ItemsWithOutdatedPrices: boolean;
  public mat017ItemsWithOldPrice: string[] = [];
  public validMat017ItemStatus = Mat017ItemStatus.active;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.mat017ItemListWithWidenData) {
      const newMat017ItemWithWidenData = changes.mat017ItemListWithWidenData.currentValue;

      this.hasMat017ItemsWithOutdatedPrices = this.getHasItemsWithOutdatedPrices(newMat017ItemWithWidenData);
      if (this.hasMat017ItemsWithOutdatedPrices) {
        this.mat017ItemsWithOldPrice = this.getItemsWithOutdatedPrices(newMat017ItemWithWidenData);
      }
    }

    if (changes.isLocked) {
      this.isLocked = !!changes.isLocked.currentValue;
    }
  }

  private getHasItemsWithOutdatedPrices(items: Mat017ItemWithWidenData[]): boolean {
    return items.some(
      (item) =>
        !!(
          item.itemStatus === this.validMat017ItemStatus &&
          !NumberUtils.areFloatsEqual(
            item?.amountDividedByPriceUnit,
            NumberUtils.round(item?.overrides?.amountDividedByPriceUnit)
          )
        )
    );
  }

  private getItemsWithOutdatedPrices(items: Mat017ItemWithWidenData[]): string[] {
    return items
      .filter(
        (item) =>
          item.itemStatus === this.validMat017ItemStatus &&
          !NumberUtils.areFloatsEqual(
            item?.amountDividedByPriceUnit,
            NumberUtils.round(item?.overrides?.amountDividedByPriceUnit)
          )
      )
      .map((item) => item.matNumber);
  }
}
