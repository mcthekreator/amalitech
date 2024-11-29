// staging environment

import type { GetAppEnvironment } from './app-environment';
import { getEnvironment as getDefaultEnvironment } from './environment.development';
import { getEnvironment as getProductionEnvironment } from './environment.production';

export const getEnvironment: GetAppEnvironment = () => {
  return {
    ...getDefaultEnvironment(),
    production: true,
    logLevel: 'error',
    cS: '7caae06c-7872-4ff7-949b-0b3c202a4057',
    sentryDsn: getProductionEnvironment().sentryDsn,
    env: 'staging',
    dataServiceUrl: 'https://data-icalc-kopla-staging.igusdev.igus.de/api/',
    koplaServicesUrl: 'https://services-kopla-staging.igusdev.igus.de',
    shopApiBaseUrl: 'https://services-kopla-staging.igusdev.igus.de/shop',
    ipServiceUrl: 'https://services-kopla-staging.igusdev.igus.de/client-ip',
  };
};
