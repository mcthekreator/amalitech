import { Module } from '@nestjs/common';
import { SingleCableCalculationApplicationModule } from '@igus/icalc-calculations-application';
import { SingleCableCalculationController } from './controllers';
import { SingleCableCalculationResponseMapperService } from './controllers/single-cable-calculation-response-mapper.service';
import { CalculationsPresentationCommonModule } from '../common/calculations-presentation-common.module';

@Module({
  imports: [SingleCableCalculationApplicationModule, CalculationsPresentationCommonModule],
  controllers: [SingleCableCalculationController],
  providers: [SingleCableCalculationResponseMapperService],
})
export class SingleCableCalculationPresentationModule {}
