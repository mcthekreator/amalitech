import { Module } from '@nestjs/common';
import { CalculationInfrastructureModule } from '@igus/icalc-calculations-infrastructure';
import { ConfigurationsInfrastructureModule } from '@igus/icalc-configurations-infrastructure';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [ConfigurationsInfrastructureModule, CalculationInfrastructureModule],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationApplicationModule {}
