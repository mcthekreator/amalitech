// integration environment

import type { GetAppEnvironment } from './app-environment';
import { getEnvironment as getDefaultEnvironment } from './environment.development';
import { getEnvironment as getProductionEnvironment } from './environment.production';

export const getEnvironment: GetAppEnvironment = () => {
  return {
    ...getDefaultEnvironment(),
    production: true,
    logLevel: 'error',
    sentryDsn: getProductionEnvironment().sentryDsn,
    env: 'integration',
    dataServiceUrl: 'https://data-icalc-kopla-integration.igusdev.igus.de/api/',
  };
};
