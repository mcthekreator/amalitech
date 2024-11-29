import { Env, LogLevel } from '@igus/kopla-data';
import type { Environment } from './environment.interface';
import { postgresEnvironment } from '@igus/icalc-postgres';
import { getEnv as getProdEnvironment } from './environment.production';

export const getEnv: () => Environment = () => {
  return {
    appName: getProdEnvironment().appName,
    logger: {
      logLevel: LogLevel.log,
    },
    service: {
      host: '0.0.0.0',
      accessHost: 'localhost',
      runPort: 3000,
      accessPort: 3000,
      id: 'fac7d6de-dd1d-4e50-b540-88181c56c8d5',
    },
    docs: getProdEnvironment().docs,
    sentry: {
      dns: '',
      tracesSampleRate: 0,
    },
    env: Env.development,
    postGres: postgresEnvironment.getDevelopment(),
    icalcFrontend: 'http://localhost:4200',
    ierp: getProdEnvironment().ierp,
    akeneoData: getProdEnvironment().akeneoData,
    smtpMailData: getProdEnvironment().smtpMailData,
    auth: getProdEnvironment().auth,
    widen: getProdEnvironment().widen,
  };
};
