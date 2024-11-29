import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, ICALC_CONNECTION } from '@igus/icalc-auth';
import { FavoritesEntity, FavoritesToMat017ItemEntity, Mat017ItemEntity, UserEntity } from '@igus/icalc-entities';
import { Signer } from '@aws-sdk/rds-signer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CalculationsInfrastructureModule } from '@igus/icalc-calculations-infrastructure';
import { ConfigurationsInfrastructureModule } from '@igus/icalc-configurations-infrastructure';
import {
  CalculationAndConfigurationCommand,
  DbLocalUserCommand,
  DbSeedCommand,
  UserCommand,
  DeleteTestdataCommand,
  Mat017ItemUpdateCommand,
  FetchFromIerpCommand,
  CompareIerpToBusinessUnitExcelCommand,
  DeleteMat017TestItemWidenImagesCommand,
  UpdateFavoritesTemplateCommand,
} from './commands';

import { AuthInfrastructureModule, getEnvironment } from '@igus/icalc-auth-infrastructure';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`${__dirname}/.env`, `${__dirname}/.env.local`] }),
    AuthModule,
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
          maxQueryExecutionTime: 120000, // temporary workaround to avoid "slow query" logs (as long as is this issue is still open: https://github.com/typeorm/typeorm/issues/8893)
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
          entities: [UserEntity, FavoritesToMat017ItemEntity, FavoritesEntity, Mat017ItemEntity],
          logging: false,
        };
      },
    }),
    CalculationsInfrastructureModule,
    ConfigurationsInfrastructureModule,
    AuthInfrastructureModule,
  ],
  providers: [
    DbLocalUserCommand,
    DeleteMat017TestItemWidenImagesCommand,
    Mat017ItemUpdateCommand,
    DbSeedCommand,
    UserCommand,
    CalculationAndConfigurationCommand,
    DeleteTestdataCommand,
    FetchFromIerpCommand,
    CompareIerpToBusinessUnitExcelCommand,
    UpdateFavoritesTemplateCommand,
  ],
})
export class AppModule {}
