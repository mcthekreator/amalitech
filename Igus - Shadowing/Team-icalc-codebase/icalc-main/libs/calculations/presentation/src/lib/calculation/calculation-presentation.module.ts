import { Module } from '@nestjs/common';
import { CalculationApplicationModule } from '@igus/icalc-calculations-application';
import { CalculationController } from './controllers/calculation.controller';
import { CalculationResponseMappersService } from './controllers/calculation-response-mappers.service';
import { CalculationsPresentationCommonModule } from '../common/calculations-presentation-common.module';

@Module({
  imports: [CalculationApplicationModule, CalculationsPresentationCommonModule],
  providers: [CalculationResponseMappersService],
  controllers: [CalculationController],
})
export class CalculationPresentationModule {}
