import type { RemoveMat017ItemsResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] RemovingMat017ItemFromConfigurations Succeeded';
  constructor(public payload: RemoveMat017ItemsResponseDto) {}
}
