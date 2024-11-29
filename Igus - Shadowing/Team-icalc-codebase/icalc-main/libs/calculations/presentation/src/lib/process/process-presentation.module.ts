import { Module } from '@nestjs/common';
import {
  CalculationApplicationModule,
  ProcessApplicationModule,
  SingleCableCalculationApplicationModule,
} from '@igus/icalc-calculations-application';
import { ProcessController } from './controllers';
import { CalculationsPresentationCommonModule } from '../common/calculations-presentation-common.module';

@Module({
  imports: [
    ProcessApplicationModule,
    SingleCableCalculationApplicationModule,
    CalculationsPresentationCommonModule,
    CalculationApplicationModule,
  ],
  controllers: [ProcessController],
})
export class ProcessPresentationModule {}
