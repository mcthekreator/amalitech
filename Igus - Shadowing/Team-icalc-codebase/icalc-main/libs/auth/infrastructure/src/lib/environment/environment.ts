import { Env } from '@igus/kopla-data';
import { env } from 'process';
import type { Environment } from './environment.interface';
import * as devEnvironment from './environment.development';
import * as intEnvironment from './environment.integration';
import * as prdEnvironment from './environment.production';
import * as stgEnvironment from './environment.staging';

/**
 * This is the environment depending on NODE_ENV variable.
 * Needs to be executed as function due to dynamic ENV variables
 */

export const getEnvironment = (): Environment => {
  switch (env.NODE_ENV) {
    case Env.integration:
      return intEnvironment.getEnv();
    case Env.staging:
      return stgEnvironment.getEnv();
    case Env.production:
      return prdEnvironment.getEnv();
    case Env.development:
    default:
      return devEnvironment.getEnv();
  }
};
