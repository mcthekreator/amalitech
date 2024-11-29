import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Mat017ItemFavoritesComponent } from './mat017-item-favorites.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { of } from 'rxjs';
import { TranslateGermanPipe } from '@icalc/frontend/app/modules/shared/pipes/translate-to-german.pipe';

describe('Mat017ItemFavoritesComponent', () => {
  let component: Mat017ItemFavoritesComponent;
  let fixture: ComponentFixture<Mat017ItemFavoritesComponent>;

  beforeEach(async () => {
    const mockDialogData = {
      favorites$: [],
      favoritesIsLoading$: false,
    };

    const mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [Mat017ItemFavoritesComponent, TranslateGermanPipe],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: ProcessStateFacadeService,
          useValue: { chainflexCable$: of({}) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Mat017ItemFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
