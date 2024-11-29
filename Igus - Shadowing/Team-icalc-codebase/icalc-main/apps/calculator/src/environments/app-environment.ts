import type { Environment } from '@igus/kopla-app';

export type GetAppEnvironment = () => AppEnvironment;
interface AppEnvironment extends Environment {
  koplaServicesUrl: string;
  sentryDsn: string;
  accessSubRoutes?: 'enabled' | 'disabled';
  sentryTunnel: string;
  sentryTracesSampleRate: number;
  dataServiceUrl?: string;
}
