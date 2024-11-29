import { Module } from '@nestjs/common';

import { CalculationsInfrastructureModule } from '@igus/icalc-calculations-infrastructure';
import { AuthInfrastructureModule } from '@igus/icalc-auth-infrastructure';
import { ConfigurationsInfrastructureModule } from '@igus/icalc-configurations-infrastructure';

import { SingleCableCalculationApplicationModule } from '../single-cable-calculation/single-cable-calculation-application.module';
import { CalculationService } from './calculation.service';
import { Mat017ItemApplicationModule } from '@igus/icalc-configurations-application';

@Module({
  imports: [
    AuthInfrastructureModule,
    CalculationsInfrastructureModule,
    SingleCableCalculationApplicationModule,
    ConfigurationsInfrastructureModule,
    Mat017ItemApplicationModule,
  ],
  providers: [CalculationService],
  exports: [CalculationService],
})
export class CalculationApplicationModule {}
