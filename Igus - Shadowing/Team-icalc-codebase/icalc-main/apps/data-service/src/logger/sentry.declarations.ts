import type { AddRequestDataToEventOptions } from '@sentry/node';

export type SentryFilterFunction = (exception: unknown) => boolean;

export interface SentryInterceptorOptionsFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  filter?: SentryFilterFunction;
}

export interface SentryInterceptorOptions {
  filters?: SentryInterceptorOptionsFilter[];
  eventOptions?: AddRequestDataToEventOptions;
}
