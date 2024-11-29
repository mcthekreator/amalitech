import { Module } from '@nestjs/common';
import { CalculationApplicationModule } from './calculation/calculation-application.module';
import { SingleCableCalculationApplicationModule } from './single-cable-calculation';
import { ProcessApplicationModule } from './process';

@Module({
  imports: [CalculationApplicationModule, SingleCableCalculationApplicationModule, ProcessApplicationModule],
  exports: [CalculationApplicationModule, SingleCableCalculationApplicationModule, ProcessApplicationModule],
})
export class CalculationsApplicationModule {}
