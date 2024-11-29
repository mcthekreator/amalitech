import type { IcalcHTTPError } from '@igus/icalc-domain';

export interface AppStateModel {
  userData: UserData;
  isUserLoggedIn: boolean;
  isLoginFailed: boolean;
  steps: IcalcStep[];
  currentStep: IcalcStep;
  mainCssClass: string;
  calcError: IcalcHTTPError;
  workStepsEdited?: boolean;
}

export interface IcalcStep {
  label: string;
  route: string;
  isDisabled: boolean;
  isVisible: boolean;
}

export interface FooterElement {
  displayText: string;
  icon?: string;
  buttonClass?: string;
  color?: string;
  routerLink?: string[];
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ProjectResponsible' | 'Customer' | 'Manager';
}
