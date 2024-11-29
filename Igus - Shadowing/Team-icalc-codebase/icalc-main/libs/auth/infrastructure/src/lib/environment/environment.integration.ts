import { postgresEnvironment } from '@igus/icalc-postgres';
import { Env, LogLevel } from '@igus/kopla-data';
import type { Environment } from './environment.interface';
import { getEnv as getProdEnvironment } from './environment.production';

export const getEnv: () => Environment = () => {
  return {
    appName: getProdEnvironment().appName,
    logger: {
      logLevel: LogLevel.log,
    },
    service: {
      host: '0.0.0.0',
      accessHost: 'data-icalc-kopla-integration.igusdev.igus.de',
      runPort: 3000,
      accessPort: 443,
      id: 'fac7d6de-dd1d-4e50-b540-88181c56c8d5',
    },
    docs: getProdEnvironment().docs,
    sentry: {
      dns: getProdEnvironment().sentry.dns,
      tracesSampleRate: 0,
    },
    env: Env.integration,
    icalcFrontend: 'https://icalc-kopla-integration.igusdev.igus.de',
    postGres: postgresEnvironment.integration,
    ierp: getProdEnvironment().ierp,
    akeneoData: getProdEnvironment().akeneoData,
    smtpMailData: getProdEnvironment().smtpMailData,
    initialUser: [
      { firstName: 'Icalc', lastName: 'Developer', email: 'de-icalc-support@igusgmbh.onmicrosoft.com', role: '' },
    ],
    auth: getProdEnvironment().auth,
    widen: getProdEnvironment().widen,
  };
};
