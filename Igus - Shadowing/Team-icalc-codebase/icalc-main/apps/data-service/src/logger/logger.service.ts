import { Logger as KoplaLogger } from '@igus/kopla-data';
import type { OnApplicationShutdown } from '@nestjs/common';
import { ConsoleLogger } from '@nestjs/common';
import { captureMessage, close } from '@sentry/node';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import type { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

export class Logger extends ConsoleLogger implements OnApplicationShutdown, TypeOrmLogger {
  private readonly typeOrmContext = `Sql query context`;
  readonly #koplaLogger = new KoplaLogger(getEnvironment().logger.logLevel);

  public logQuery(_query: string, _parameters?: unknown[], _queryRunner?: QueryRunner): void {}

  public logQueryError(
    _error: string | Error,
    _query: string,
    _parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {}

  public logQuerySlow(time: number, query: string, _parameters?: unknown[], _queryRunner?: QueryRunner): void {
    super.warn(query, `${this.typeOrmContext}: Following query took too long (${time}ms).`);
  }

  public logSchemaBuild(_message: string, _queryRunner?: QueryRunner): void {}

  public logMigration(_message: string, _queryRunner?: QueryRunner): void {}

  public log(message: string, context?: string): void {
    super.log(message, context);
    captureMessage(message, 'log');
  }

  public error(message: string, trace?: string, context?: string): void {
    super.error(message, trace, context);
    captureMessage(message, 'error');
  }

  public warn(message: string, context?: string): void {
    super.warn(message, context);
    captureMessage(message, 'warning');
  }

  public debug(message: string, context?: string): void {
    super.debug(message, context);
    captureMessage(message, 'debug');
  }

  public verbose(message: string, context?: string): void {
    super.verbose(message, context);
    captureMessage(message, 'info');
  }

  public getKoplaLogger(): KoplaLogger {
    return this.#koplaLogger;
  }

  public async onApplicationShutdown(): Promise<void> {
    await close();
  }
}
