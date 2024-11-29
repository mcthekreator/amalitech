import { Handlers, init, Integrations } from '@sentry/node';
import type * as Express from 'express';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { DATA_SERVICE_VERSION } from './version';

/**
 * Initialize Sentry with default for express
 *
 * @param app The express app
 */
export const initializeSentry = (app: Express.Router): void => {
  init({
    ...getEnvironment().sentry,
    environment: getEnvironment().env,
    release: `icalc-data-service@${DATA_SERVICE_VERSION}`,
    integrations: [new Integrations.Http({ tracing: true }), new Integrations.Express({ app })],
  });

  app.use(Handlers.requestHandler());
  app.use(Handlers.tracingHandler());
};
