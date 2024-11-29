import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Mat017ItemsUpdateComponent } from './mat017-items-update.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { type Observable, of } from 'rxjs';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

describe('Mat017ItemsUpdateComponent', () => {
  let component: Mat017ItemsUpdateComponent;
  let fixture: ComponentFixture<Mat017ItemsUpdateComponent>;

  const matDialogMock = {
    open: () => {
      jest.fn();
      return {
        afterClosed: () => of({ reset: undefined }),
      };
    },
  };

  const processStateFacadeService = {
    isLocked$: (): Observable<boolean> => of(false),
    mat017ItemListWithNewPrices$: of([]),
    hasAnyMat017ItemPriceChanged: (): Observable<boolean> => of(false),
    showNewMat017ItemPricesInfo$: (): Observable<boolean> => of(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [Mat017ItemsUpdateComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: MatDialog,
          useValue: matDialogMock,
        },
        {
          provide: ProcessStateFacadeService,
          useValue: processStateFacadeService,
        },
        {
          provide: MatDialogRef,
          useValue: {
            dialogRef: of(null),
          },
        },
      ],
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mat017ItemsUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Mat017ItemsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
