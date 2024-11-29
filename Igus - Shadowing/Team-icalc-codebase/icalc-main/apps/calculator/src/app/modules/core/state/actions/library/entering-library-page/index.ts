import type { LibraryStateModel } from '../../../library-state/library-state.model';

export class Started {
  public static readonly type = '[Library] EnteringLibraryPage Started';
}

export class Entered {
  public static readonly type = '[Library] EnteringLibraryPage Entered';
  constructor(public payload: Partial<LibraryStateModel> | null) {}
}
