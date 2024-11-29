import { Component, ChangeDetectionStrategy } from '@angular/core';
import type { FormControl, ValidationErrors } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import type { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public userName: string;
  public form = new FormGroup({});
  public model: { email: string; password: string } = { email: '', password: '' };
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'login.user.EMAIL',
        placeholder: 'login.user.EMAIL',
        translate: true,
        required: true,
        appearance: 'outline',
        attributes: {
          dataCy: 'email-input',
        },
      },
      validators: {
        validation: [this.emailValidator],
      },
    },
    {
      key: 'password',
      type: 'input',
      props: {
        type: 'password',
        label: 'login.user.PASSWORD',
        placeholder: 'login.user.PASSWORD',
        translate: true,
        required: true,
        appearance: 'outline',
        attributes: {
          dataCy: 'password-input',
        },
      },
    },
  ];

  public isUserLoggedIn$: Observable<boolean>;
  public isLoginFailed$: Observable<boolean>;

  constructor(private appStateFacadeService: AppStateFacadeService) {
    this.isLoginFailed$ = this.appStateFacadeService.isLoginFailed$;
    this.isUserLoggedIn$ = this.appStateFacadeService.isUserLoggedIn$;
  }

  public onLogin(): void {
    this.appStateFacadeService.loginUser(this.model);
    this.form.markAsPristine();
  }

  private emailValidator(control: FormControl): ValidationErrors {
    return !control.value ||
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        control.value
      )
      ? null
      : { email: true };
  }
}
