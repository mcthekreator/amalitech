import type { LibraryStateModel } from '../../../library-state/library-state.model';

export class Started {
  public static readonly type = '[Library] LeavingLibraryPage Started';
  constructor(public payload: Partial<LibraryStateModel> | null) {}
}
