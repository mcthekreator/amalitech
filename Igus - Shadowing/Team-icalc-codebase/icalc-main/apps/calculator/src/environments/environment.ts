// This is the default environment.

import type { GetAppEnvironment } from './app-environment';
import { getEnvironment as getDefaultEnvironment } from './environment.development';

export const getEnvironment: GetAppEnvironment = () => getDefaultEnvironment();
