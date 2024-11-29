import { Module } from '@nestjs/common';
import { CalculationInfrastructureModule } from './calculation/calculation-infrastructure.module';
import { SingleCableCalculationInfrastructureModule } from './single-cable-calculation';

@Module({
  imports: [CalculationInfrastructureModule, SingleCableCalculationInfrastructureModule],
  exports: [CalculationInfrastructureModule, SingleCableCalculationInfrastructureModule],
})
export class CalculationsInfrastructureModule {}
