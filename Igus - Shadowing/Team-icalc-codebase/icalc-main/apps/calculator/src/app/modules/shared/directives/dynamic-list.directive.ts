import type { OnDestroy, AfterContentChecked, AfterContentInit } from '@angular/core';
import { Directive, EventEmitter, Output, QueryList, ViewContainerRef, ContentChildren } from '@angular/core';
import { Subscription } from 'rxjs';

const toNativeElement = (item: DynamicListItemDirective): HTMLElement => item.viewContainerRef.element.nativeElement;

@Directive({ selector: '[icalcDynamicListItem]' })
export class DynamicListItemDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Directive({
  selector: '[icalcDynamicList]',
})
export class DynamicListDirective implements AfterContentChecked, AfterContentInit, OnDestroy {
  @Output() public readonly elementsListUpdate = new EventEmitter<HTMLElement[]>();

  @ContentChildren(DynamicListItemDirective)
  private dynamicListItems: QueryList<DynamicListItemDirective>;

  private subscriptions = new Subscription();
  private dynamicListItemsAsArray: HTMLElement[];

  private hasEmittedChanges: boolean;

  public ngAfterContentInit(): void {
    this.subscriptions.add(
      this.dynamicListItems.changes.subscribe((queryList: QueryList<DynamicListItemDirective>) => {
        if (queryList.length > 0) {
          this.dynamicListItemsAsArray = queryList.toArray().map(toNativeElement);
          this.elementsListUpdate.emit(this.dynamicListItemsAsArray);
          this.hasEmittedChanges = true;
        }
      })
    );
  }

  public ngAfterContentChecked(): void {
    if (this.dynamicListItems.length > 0 && !this.hasEmittedChanges) {
      this.dynamicListItemsAsArray = this.dynamicListItems.toArray().map(toNativeElement);
      this.elementsListUpdate.emit(this.dynamicListItemsAsArray);
      this.hasEmittedChanges = true;
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.hasEmittedChanges = false;
  }
}
