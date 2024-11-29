import { Module } from '@nestjs/common';
import {
  CalculationInfrastructureModule,
  SingleCableCalculationInfrastructureModule,
} from '@igus/icalc-calculations-infrastructure';
import { ConfigurationsApplicationModule } from '@igus/icalc-configurations-application';
import { SingleCableCalculationApplicationModule } from '../single-cable-calculation';
import { ConvertToXlsService, ExcelService, ProcessService } from './services';

@Module({
  imports: [
    SingleCableCalculationApplicationModule,
    ConfigurationsApplicationModule,
    CalculationInfrastructureModule,
    SingleCableCalculationInfrastructureModule,
  ],
  providers: [ProcessService, ExcelService, ConvertToXlsService],
  exports: [ProcessService, ExcelService],
})
export class ProcessApplicationModule {}
