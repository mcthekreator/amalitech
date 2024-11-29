import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Mat017ItemRemovalDialogComponent } from './mat017-item-removal-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';

describe('Mat017ItemRemovalDialogComponent', () => {
  let component: Mat017ItemRemovalDialogComponent;
  let fixture: ComponentFixture<Mat017ItemRemovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [Mat017ItemRemovalDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ProcessStateFacadeService,
          useValue: {
            mat017ItemListWithNoPrices$: of([]),
          },
        },
      ],
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mat017ItemRemovalDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Mat017ItemRemovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
