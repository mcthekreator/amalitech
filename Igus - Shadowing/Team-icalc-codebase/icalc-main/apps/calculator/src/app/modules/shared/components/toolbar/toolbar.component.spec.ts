import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { Angulartics2 } from 'angulartics2';
import { of, Subject } from 'rxjs';
import { ToolbarComponent } from './toolbar.component';
import { RouterModule } from '@angular/router';

class Angulartics2Mock {
  public eventTrack = new Subject();
}

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ToolbarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AppStateFacadeService, useValue: { steps$: of([]) } },
        { provide: Angulartics2, useClass: Angulartics2Mock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
