import { Module } from '@nestjs/common';
import { LoggerModule } from '../../../logger';
import { ChainflexService } from './services';
import { ConfigurationsInfrastructureModule } from '@igus/icalc-configurations-infrastructure';

@Module({
  imports: [LoggerModule, ConfigurationsInfrastructureModule],
  providers: [ChainflexService],
  exports: [ChainflexService],
})
export class ChainflexApplicationModule {}
