import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LiabilityDisclaimerService } from '@igus/kopla-app';
import { DisclaimerGuard } from './disclaimer.guard';

describe('DisclaimerGuard', () => {
  class RouterMock {
    public navigate(): Promise<void> {
      return Promise.resolve();
    }
  }

  class LiabilityDisclaimerServiceMock {
    public isAccepted(): boolean {
      return false;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DisclaimerGuard,
        { provide: Router, useClass: RouterMock },
        { provide: LiabilityDisclaimerService, useClass: LiabilityDisclaimerServiceMock },
      ],
    });
  });

  let guard: DisclaimerGuard;
  let navigateSpy: jest.SpyInstance;

  beforeEach(inject([DisclaimerGuard], (_guard: DisclaimerGuard) => {
    guard = _guard;
    navigateSpy = jest.spyOn(RouterMock.prototype, 'navigate');
  }));

  describe('canActivateChild', () => {
    it('should not activate and if disclaimer is not accepted', () => {
      void expect(guard.canActivate()).toBeFalsy();
      void expect(navigateSpy).toHaveBeenCalled();
    });

    it('should activate if disclaimer is accepted', waitForAsync(() => {
      jest.spyOn(LiabilityDisclaimerServiceMock.prototype, 'isAccepted').mockReturnValue(true);
      void expect(guard.canActivate()).toBe(true);
      void expect(navigateSpy).not.toHaveBeenCalled();
    }));
  });
});
