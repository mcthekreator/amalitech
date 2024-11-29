import type { UpdateConfigurationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] UpdatingConfigurationData Succeeded';
  constructor(public payload: UpdateConfigurationResponseDto) {}
}
