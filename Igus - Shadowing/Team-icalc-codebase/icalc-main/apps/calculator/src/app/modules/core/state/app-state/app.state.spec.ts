import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './app.state';
describe('todo state test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AppState])],
    }).compileComponents();
  });

  it('dummy', () => {});
});
