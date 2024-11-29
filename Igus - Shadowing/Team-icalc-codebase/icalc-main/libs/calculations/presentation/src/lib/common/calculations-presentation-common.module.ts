import { Module } from '@nestjs/common';
import { CalculationsPresentationMapperService } from './calculations-presentation-mapper.service';
import { Mat017ItemInfrastructureModule } from '@igus/icalc-configurations-infrastructure';

@Module({
  imports: [Mat017ItemInfrastructureModule],
  exports: [CalculationsPresentationMapperService],
  providers: [CalculationsPresentationMapperService],
})
export class CalculationsPresentationCommonModule {}
