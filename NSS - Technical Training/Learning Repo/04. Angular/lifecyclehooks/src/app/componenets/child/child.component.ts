import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrl: './child.component.css'
})
export class ChildComponent {
  @Input() myCounter!: number;

  public changelog: string[] = []

  ngOnChanges(changes: SimpleChanges): void {
    for(const propName in changes){
      const change: SimpleChange = changes[propName];

      const current = JSON.stringify(change.currentValue)
      const previous = JSON.stringify(change.previousValue)

      this.changelog.push(
        `ngOChanges ${propName}: curentValue = ${current}, previousValue = ${previous}` 
      )
    }
  }
}
