import type { UserData } from './app-state.model';

export class SetUser {
  public static readonly type = '[SetUser] sets the user inside the state';
  constructor(public userData: UserData) {}
}

export class GetUser {
  public static readonly type = '[GetUser] gets the user from the state';
}

export class RemoveUser {
  public static readonly type = '[RemoveUser] removes the user from the state';
}

export class LoginUser {
  public static readonly type = '[LoginUser] logs the user in';
  constructor(
    public payload: {
      email: string;
      password: string;
    }
  ) {}
}

export class LogoutUser {
  public static readonly type = '[LogoutUser] logs the user out';
}
