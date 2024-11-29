import { browserTracingIntegration, init } from '@sentry/angular-ivy';
import { getEnvironment } from './environments/environment';
import { ICALC_APP_VERSION } from './version';

const environment = getEnvironment();

export const initSentry = (): void =>
  init({
    dsn: environment.sentryDsn,
    tunnel: environment.sentryTunnel,
    environment: environment.env,
    release: `icalc-calculator@${ICALC_APP_VERSION}`,
    tracesSampleRate: environment.sentryTracesSampleRate,
    integrations: [browserTracingIntegration()],
    tracePropagationTargets: [/^\//, environment.koplaServicesUrl],
  });
