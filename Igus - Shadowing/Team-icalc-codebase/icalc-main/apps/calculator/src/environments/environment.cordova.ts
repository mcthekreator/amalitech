// cordova environment

import { CordovaFeatureList } from '../app/feature-map';
import type { GetAppEnvironment } from './app-environment';
import { getEnvironment as getIntegrationEnvironment } from './environment.integration';
import { getEnvironment as getProductionEnvironment } from './environment.production';

export const getEnvironment: GetAppEnvironment = () => {
  return {
    ...getProductionEnvironment(),
    production: getIntegrationEnvironment().production,
    logLevel: getIntegrationEnvironment().logLevel,
    featureList: CordovaFeatureList,
    useHash: true,
  };
};
