import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Mat017ItemInvalidInfoComponent } from './mat017-item-invalid-info.component';

describe('Mat017ItemInvalidInfoComponent', () => {
  let component: Mat017ItemInvalidInfoComponent;
  let fixture: ComponentFixture<Mat017ItemInvalidInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mat017ItemInvalidInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Mat017ItemInvalidInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
