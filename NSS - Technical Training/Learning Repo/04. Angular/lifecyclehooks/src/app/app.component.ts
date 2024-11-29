import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private number : number  = 23948234824

  get counter(){
    return this.number;
  }
  set counter(value: number ){
    this.number = value;
  }

  increment(){
    this.counter++
  }
  decrement(){
    this.counter--
  }
}
