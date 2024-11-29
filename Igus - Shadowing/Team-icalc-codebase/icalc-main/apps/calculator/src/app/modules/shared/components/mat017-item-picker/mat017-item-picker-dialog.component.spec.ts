import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { Mat017ItemPickerDialogComponent } from './mat017-item-picker-dialog.component';

describe('Mat017ItemPickerDialogComponent', () => {
  let component: Mat017ItemPickerDialogComponent;
  let fixture: ComponentFixture<Mat017ItemPickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), NoopAnimationsModule],
      declarations: [Mat017ItemPickerDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            dialogRef: {
              mat017Items: [],
            },
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mat017Items: [],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Mat017ItemPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
