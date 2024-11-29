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
      accessHost: 'data-icalc-kopla-staging.igusdev.igus.de',
      runPort: 3000,
      accessPort: 443,
      id: '7caae06c-7872-4ff7-949b-0b3c202a4057',
    },
    docs: getProdEnvironment().docs,
    sentry: {
      dns: getProdEnvironment().sentry.dns,
      tracesSampleRate: 0,
    },
    env: Env.staging,
    icalcFrontend: 'https://icalc-kopla-staging.igusdev.igus.de',
    postGres: postgresEnvironment.staging,
    ierp: getProdEnvironment().ierp,
    akeneoData: getProdEnvironment().akeneoData,
    smtpMailData: getProdEnvironment().smtpMailData,
    initialUser: [
      { firstName: 'Lars', lastName: 'Ruhnau', email: 'lars.ruhnau@aleri.de', role: '' },
      { firstName: 'Konstantin', lastName: 'Kluev', email: 'kkluev@igus.net', role: '' },
      { firstName: 'Stefan', lastName: 'Niesen', email: 'sniesen@igus.net', role: '' },
      { firstName: 'Bente', lastName: 'Schwarz', email: 'BSchwarz@igus.net', role: '' },
      { firstName: 'Thomas', lastName: 'Seel', email: 'tseel@igus.net', role: '' },
      { firstName: 'Sebastiaan', lastName: 'Koelewijn', email: 'skoelewijn@igus.net', role: '' },
      { firstName: 'Raphael', lastName: 'Friedli', email: 'rfriedli@igus.net', role: '' },
      { firstName: 'Dimitrios', lastName: 'Tsekmetzis', email: 'dtsekmetzis@igus.net', role: '' },
      { firstName: 'Emile', lastName: 'Scott', email: 'escott@igus.net', role: '' },
      { firstName: 'Dennis', lastName: 'Eichhorst', email: 'deichhorst@igus.net', role: '' },
      { firstName: 'Dirk', lastName: 'Heidgen', email: 'dheidgen@igus.net', role: '' },
      { firstName: 'Wolfgang', lastName: 'Kahl', email: 'wkahl@igus.net', role: '' },
      { firstName: 'Nico', lastName: 'Tiegs', email: 'ntiegs@igus.net', role: '' },
    ],
    auth: getProdEnvironment().auth,
    widen: getProdEnvironment().widen,
  };
};
