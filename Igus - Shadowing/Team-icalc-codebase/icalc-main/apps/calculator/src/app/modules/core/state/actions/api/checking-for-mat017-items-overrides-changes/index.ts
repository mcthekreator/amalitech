import type { HaveMat017ItemsOverridesChangedResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] CheckingForMat017ItemsOverridesChanges Succeeded';
  constructor(public payload: HaveMat017ItemsOverridesChangedResponseDto) {}
}
