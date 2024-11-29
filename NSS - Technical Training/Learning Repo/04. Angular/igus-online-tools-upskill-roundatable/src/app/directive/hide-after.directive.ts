import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHideAfter]'
})
export class HideAfterDirective implements OnInit {
  private veiwContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef)
  @Input("appHideAfter") delay: number = 0

  constructor() { }

  ngOnInit(): void {
    this.veiwContainerRef.createEmbeddedView(this.templateRef)

    setTimeout(() => {
      this.veiwContainerRef.clear()
    },this.delay );
  }
}
