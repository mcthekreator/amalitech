import { CdkPortal, DomPortalOutlet } from '@angular/cdk/portal';
import type { AfterViewInit, OnDestroy } from '@angular/core';
import { ApplicationRef, Component, Injector, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';

/**
 * Component to open a portal anywhere in the application.
 * For usage see footer component allowing 3 portals
 * and all the 'step' components making use of the portal to display related
 * buttons with local event handlers.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-cdk-portal',
  template: `
    <ng-template cdk-portal>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: [],
})
export class CdkPortalComponent implements AfterViewInit, OnDestroy {
  @Input()
  public selectorId: string;

  @ViewChild(CdkPortal)
  private portal: CdkPortal;

  private host: DomPortalOutlet;

  constructor(
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  public ngAfterViewInit(): void {
    this.host = new DomPortalOutlet(
      document.querySelector(`#${this.selectorId}`),
      null,
      this.applicationRef,
      this.injector
    );
    this.host.attach(this.portal);
  }

  public ngOnDestroy(): void {
    this.host.detach();
  }
}
