import {
  CalculationEntity,
  CalculationConfigurationStatusEntity,
  FavoritesToMat017ItemEntity,
} from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { AuthInfrastructureModule } from '@igus/icalc-auth-infrastructure';
import { ConfigurationsInfrastructureModule } from '@igus/icalc-configurations-infrastructure';
import { SingleCableCalculationInfrastructureModule } from '../single-cable-calculation';
import { CalculationConfigurationStatusDataAccessService } from './calculation-configuration-status-data-access.service';
import { CalculationDataAccessService } from './calculation-data-access.service';
import { DbSeedService } from './db-seed.service';

@Module({
  imports: [
    AuthInfrastructureModule,
    SingleCableCalculationInfrastructureModule,
    ConfigurationsInfrastructureModule,
    TypeOrmModule.forFeature(
      [FavoritesToMat017ItemEntity, CalculationEntity, CalculationConfigurationStatusEntity],
      ICALC_CONNECTION
    ),
  ],
  providers: [CalculationDataAccessService, CalculationConfigurationStatusDataAccessService, DbSeedService],
  exports: [
    CalculationDataAccessService,
    CalculationConfigurationStatusDataAccessService,
    TypeOrmModule,
    DbSeedService,
  ],
})
export class CalculationInfrastructureModule {}
