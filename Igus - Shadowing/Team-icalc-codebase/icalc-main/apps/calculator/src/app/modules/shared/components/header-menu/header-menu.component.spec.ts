import { NO_ERRORS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LiabilityDisclaimerServiceMockProvider,
  NotificationServiceMockProvider,
  UnitSystemResolver,
} from '@igus/kopla-app';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2 } from 'angulartics2';
import { of } from 'rxjs';
import { Angulartics2MockProvider } from '../../../core/mock/angulartics.provider.mock';
import { TranslatePipeStub } from '../../../core/mock/translate.pipe.mock';
import { AppStateFacadeService } from '../../../core/state/app-state/app-state-facade.service';
import { HeaderMenuComponent } from './header-menu.component';

class TranslateServiceMock {}
class UnitSystemResolverMock {
  public unitSystem$ = of(true);
}
class RouterMock {
  public navigate(): Promise<void> {
    return Promise.resolve();
  }
}
describe('HeaderMenuComponent', () => {
  let angulartics2: Angulartics2;
  let component: HeaderMenuComponent;
  let fixture: ComponentFixture<HeaderMenuComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let eventTrackNextSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        FormBuilder,
        Angulartics2MockProvider,
        NotificationServiceMockProvider,
        LiabilityDisclaimerServiceMockProvider,
        { provide: Router, useClass: RouterMock },
        { provide: UnitSystemResolver, useClass: UnitSystemResolverMock },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: AppStateFacadeService, useValue: { removeUser: (): void => {} } },
      ],
      declarations: [HeaderMenuComponent, TranslatePipeStub],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    angulartics2 = TestBed.inject(Angulartics2);
    fixture = TestBed.createComponent(HeaderMenuComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    eventTrackNextSpy = angulartics2.eventTrack.next;
  });

  it('should create the component', () => {
    void expect(component).toBeDefined();
  });

  it('should track new configuration click', waitForAsync(() => {
    component.trackNewConfigClick();
    void expect(eventTrackNextSpy).toHaveBeenCalled();
    void expect(eventTrackNextSpy).toHaveBeenCalledWith({ action: 'MyConfig|ResetConfig|List' });
  }));

  it('should track menu icon click', waitForAsync(() => {
    component.trackMenuIconClick();
    void expect(eventTrackNextSpy).toHaveBeenCalled();
    void expect(eventTrackNextSpy).toHaveBeenCalledWith({ action: 'Menu|Button' });
  }));

  it('should track view click', waitForAsync(() => {
    component.trackViewClick('configuration');
    void expect(eventTrackNextSpy).toHaveBeenCalled();
    void expect(eventTrackNextSpy).toHaveBeenCalledWith({ action: 'MyConfig|List' });

    component.trackViewClick('unitsystemswitch');
    void expect(eventTrackNextSpy).toHaveBeenCalled();
    void expect(eventTrackNextSpy).toHaveBeenCalledWith({ action: 'Settings|List' });
  }));
});
