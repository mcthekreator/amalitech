import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LiabilityDisclaimerService } from '@igus/kopla-app';

@Injectable({
  providedIn: 'root',
})
export class DisclaimerGuard {
  constructor(
    private readonly router: Router,
    private readonly liabilityDisclaimerService: LiabilityDisclaimerService
  ) {}

  public canActivate(): boolean {
    if (!this.liabilityDisclaimerService.isAccepted()) {
      void this.router.navigate(['configuration'], { queryParamsHandling: 'preserve' });
      return false;
    }
    return true;
  }
}
