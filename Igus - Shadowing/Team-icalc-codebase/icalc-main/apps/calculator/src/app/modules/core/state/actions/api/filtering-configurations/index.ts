import type { FilterConfigurationResponseDto } from '@igus/icalc-domain';

export class Succeeded {
  public static readonly type = '[Api] FilteringConfigurations Succeeded';
  constructor(public payload: FilterConfigurationResponseDto) {}
}

export class Failed {
  public static readonly type = '[Api] FilteringConfigurations Failed';
  constructor(public payload: FilterConfigurationResponseDto) {}
}
