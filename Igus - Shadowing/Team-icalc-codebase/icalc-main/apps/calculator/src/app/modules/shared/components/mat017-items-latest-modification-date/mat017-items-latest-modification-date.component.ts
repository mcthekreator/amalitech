import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-mat017-items-latest-modification-date',
  templateUrl: './mat017-items-latest-modification-date.component.html',
  styleUrls: ['./mat017-items-latest-modification-date.component.scss'],
})
export class Mat017ItemsLatestModificationDateComponent {
  @Input()
  public latestModificationDate: Date;
}
