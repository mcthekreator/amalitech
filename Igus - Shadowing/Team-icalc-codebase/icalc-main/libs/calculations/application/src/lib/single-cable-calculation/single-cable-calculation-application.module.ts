import { Module } from '@nestjs/common';
import { StateChangeCheckService } from './services/state-change-check.service';
import { SingleCableCalculationService, StatusService } from './services';
import { CalculationsInfrastructureModule } from '@igus/icalc-calculations-infrastructure';

import { ConfigurationsInfrastructureModule } from '@igus/icalc-configurations-infrastructure';
import { AuthInfrastructureModule } from '@igus/icalc-auth-infrastructure';
import { ChainflexPriceChangeCheckService } from './services/chainflex-price-change-check.service';

@Module({
  imports: [CalculationsInfrastructureModule, ConfigurationsInfrastructureModule, AuthInfrastructureModule],
  providers: [SingleCableCalculationService, StateChangeCheckService, StatusService, ChainflexPriceChangeCheckService],
  exports: [SingleCableCalculationService, StatusService, StateChangeCheckService, ChainflexPriceChangeCheckService],
})
export class SingleCableCalculationApplicationModule {}
