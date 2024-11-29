import { Signer } from '@aws-sdk/rds-signer';
import { UserEntity } from '@igus/icalc-entities';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GotModule } from '@t00nday/nestjs-got';
import { readFileSync } from 'fs';
import { join } from 'path';

import { AppController } from './app.controller';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { Logger, LoggerModule, SentryInterceptor } from './logger';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AkeneoModule } from './modules/akeneo/akeneo.module';
import { AuthModule } from './modules/auth/auth.module';

import { ChainflexModule } from './modules/chainflex/chainflex.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { AccessTokenGuard } from './modules/shared/guards';
import { AppInitService } from './services/app-init.service';
import { MailModule } from './modules/mail/mail.module';
import { CalculationsPresentationModule } from '@igus/icalc-calculations-presentation';
import { ConfigurationsPresentationModule } from '@igus/icalc-configurations-presentation';
import { ConfigurationsInfrastructureModule } from '@igus/icalc-configurations-infrastructure';

@Module({
  controllers: [AppController],
  imports: [
    RouterModule.register([]),
    LoggerModule,
    GotModule.register(),
    CalculationsPresentationModule,
    ConfigurationsPresentationModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
    TypeOrmModule.forRootAsync({
      name: ICALC_CONNECTION,
      useFactory: async () => {
        const pgConfig = getEnvironment().postGres;

        return {
          name: ICALC_CONNECTION,
          type: 'postgres',
          host: pgConfig?.postgresHost,
          port: +pgConfig?.postgresPort,
          username: pgConfig?.postgresUser,
          logger: new Logger(),
          logging: ['query', 'info'],
          maxQueryExecutionTime: 1000,
          password: async (): Promise<string> => {
            if (getEnvironment().postGres?.isLocal !== true) {
              return new Signer({
                region: pgConfig?.postGresRegion,
                username: pgConfig?.postgresUser,
                hostname: pgConfig?.postgresHost,
                port: +pgConfig?.postgresPort,
              }).getAuthToken();
            }
            return pgConfig?.postgresPassword;
          },
          database: pgConfig?.postgresDatabase || '',
          ssl:
            getEnvironment().postGres?.isLocal !== true
              ? {
                  ca: readFileSync(join(__dirname, './global-bundle.pem')).toString(),
                }
              : null,
          autoLoadEntities: true,
          entities: [UserEntity],
          logNotifications: true,
        };
      },
    }),
    ChainflexModule,
    FavoritesModule,
    AkeneoModule,
    AuthModule,
    MailModule,
    ConfigurationsInfrastructureModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (): SentryInterceptor => new SentryInterceptor(),
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AppInitService,
  ],
  exports: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
