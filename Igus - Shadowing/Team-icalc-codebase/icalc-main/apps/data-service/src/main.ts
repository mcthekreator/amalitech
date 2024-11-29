import { ShutdownSignal, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'body-parser';
import { types } from 'pg';

import { AppModule } from './app.module';
import { setupDocs } from './docs';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { AllExceptionsFilter } from './error';
import { Logger } from './logger';
import { initializeSentry } from './sentry';

const { service, icalcFrontend } = getEnvironment();
const { runPort: port, host } = service;

const bootstrap = async (): Promise<void> => {
  /**
   * PG converts numeric values as string in order to avoid exceeding the
   * JS integer size here we override this feature
   */
  types.setTypeParser(1700, (value: string) => {
    return parseFloat(value);
  });

  const app = await NestFactory.create(AppModule, {
    cors: false,
    bodyParser: false,
    bufferLogs: true,
  });

  app.setGlobalPrefix('api');

  initializeSentry(app.getHttpAdapter().getInstance());

  // Enable json and cors to support body in global middlewares
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb', parameterLimit: 999 }));
  app.enableCors({
    origin: icalcFrontend,
    credentials: true,
    methods: 'GET, OPTIONS, POST, PUT, PATCH, DELETE',
    allowedHeaders:
      'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Kopla-Service-ID, sentry-trace',
  });

  app.useGlobalPipes(new ValidationPipe());

  // Globals
  const logger = app.get(Logger);

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Attach docs route
  await setupDocs(app);

  /**
   * Graceful service stop
   * e.g. shutdown database connections, ...
   *
   * @see http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#graceful-stop
   */
  app.enableShutdownHooks([ShutdownSignal.SIGINT]);

  await app.listen(port, host, async () => {
    app.useLogger(logger);
    logger.log(`Server is listening at ${port}`);

    /**
     * Sends 'ready' information to pm2 process
     *
     * @see http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#configure-the-ready-timeout
     */
    process.send?.('ready');
  });
};

void bootstrap();
