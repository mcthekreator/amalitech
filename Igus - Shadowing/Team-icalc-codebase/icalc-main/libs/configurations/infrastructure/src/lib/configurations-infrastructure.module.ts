import { Module } from '@nestjs/common';
import { ConfigurationInfrastructureModule } from './configuration/configuration-infrastructure.module';
import { ChainflexInfrastructureModule } from './chainflex';
import { Mat017ItemInfrastructureModule } from './mat017-item';
import { FavoriteInfrastructureModule } from './favorites';

@Module({
  imports: [
    ConfigurationInfrastructureModule,
    Mat017ItemInfrastructureModule,
    ChainflexInfrastructureModule,
    FavoriteInfrastructureModule,
  ],
  exports: [
    ConfigurationInfrastructureModule,
    Mat017ItemInfrastructureModule,
    ChainflexInfrastructureModule,
    FavoriteInfrastructureModule,
  ],
})
export class ConfigurationsInfrastructureModule {}
