import {Component, HostListener} from '@angular/core';
import {ChildComponent} from "../child/child.component";

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ ChildComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {
  items = [1, 2, 3];

  modifyItems() {
    this.items = [...this.items, 4];
  }
}
