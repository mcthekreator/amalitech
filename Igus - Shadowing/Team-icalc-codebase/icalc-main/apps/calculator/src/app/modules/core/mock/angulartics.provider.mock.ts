import type { Provider } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

export class Angulartics2Mock {
  public eventTrack = {
    next: jest.fn(),
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Angulartics2MockProvider: Provider = { provide: Angulartics2, useClass: Angulartics2Mock };
