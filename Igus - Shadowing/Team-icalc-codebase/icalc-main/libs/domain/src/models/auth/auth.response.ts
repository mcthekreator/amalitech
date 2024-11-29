export type IcalcAuthResponse =
  | 'logged-out'
  | 'refreshed'
  | { email: string; firstName: string; lastName: string }
  | 'failed'
  | 'user-deleted'
  | 'signed-up';
