import { Module } from '@nestjs/common';
import { CalculationPresentationModule } from './calculation/calculation-presentation.module';
import { SingleCableCalculationPresentationModule } from './single-cable-calculation';
import { ProcessPresentationModule } from './process';

@Module({
  imports: [CalculationPresentationModule, SingleCableCalculationPresentationModule, ProcessPresentationModule],
  exports: [CalculationPresentationModule, SingleCableCalculationPresentationModule, ProcessPresentationModule],
})
export class CalculationsPresentationModule {}
