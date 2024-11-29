// production environment

import type { GetAppEnvironment } from './app-environment';
import { getEnvironment as getDefaultEnvironment } from './environment.development';

export const getEnvironment: GetAppEnvironment = () => {
  return {
    ...getDefaultEnvironment(),
    production: true,
    logLevel: 'error',
    cS: '1565173c-ec19-459a-8e32-f3d5f760217f',
    sentryDsn: 'https://6fdaa312fbcb4bdcb831832609444f6a@o263529.ingest.sentry.io/6258363',
    env: 'production',
    dataServiceUrl: 'https://data-icalc.igus.tools/api/',
    koplaServicesUrl: 'https://services.igus.tools',
    shopApiBaseUrl: 'https://services.igus.tools/shop',
    ipServiceUrl: 'https://services.igus.tools/client-ip',
    sentryTracesSampleRate: 0.01,
    featureFlagSwitcher: false,
  };
};
