import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IcalcListInformation } from '@igus/icalc-domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-table-sort-icon',
  templateUrl: './table-sort-icon.component.html',
  styleUrls: ['./table-sort-icon.component.scss'],
})
export class TableSortIconComponent {
  @Input() public listInformation: IcalcListInformation;
  @Input() public columnName: string;
}
