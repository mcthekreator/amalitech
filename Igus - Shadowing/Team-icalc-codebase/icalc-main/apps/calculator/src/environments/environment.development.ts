// This is the default environment.

import process from 'process';
import { ApplicationFeatureList } from '../app/feature-map';
import type { GetAppEnvironment } from './app-environment';

export const getEnvironment: GetAppEnvironment = () => {
  return {
    production: false,
    logLevel: 'debug',
    cS: 'fac7d6de-dd1d-4e50-b540-88181c56c8d5',
    accessSubRoutes: 'disabled',
    featureList: ApplicationFeatureList,
    featureFlagSwitcher: true,
    sentryDsn: '',
    sentryTunnel: 'https://kopla-tunnel.igus.tools/bugs',
    sentryTracesSampleRate: 0,
    env: 'development',
    dataServiceUrl: (process.env.DATA_SERVICE_URL || 'http://localhost:3000/api') + '/',
    shopApiBaseUrl: 'https://services-kopla-integration.igusdev.igus.de/shop',
    koplaServicesUrl: 'https://services-kopla-integration.igusdev.igus.de',
    ipServiceUrl: 'https://services-kopla-integration.igusdev.igus.de/client-ip',
  };
};
