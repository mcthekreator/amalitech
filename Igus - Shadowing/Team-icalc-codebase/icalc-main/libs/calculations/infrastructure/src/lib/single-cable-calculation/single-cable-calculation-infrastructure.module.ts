import { CalculationConfigurationStatusEntity, SingleCableCalculationEntity } from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { SingleCableCalculationDataAccessService } from './single-cable-calculation-data-access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SingleCableCalculationEntity, CalculationConfigurationStatusEntity], ICALC_CONNECTION),
  ],
  providers: [SingleCableCalculationDataAccessService],
  exports: [SingleCableCalculationDataAccessService, TypeOrmModule],
})
export class SingleCableCalculationInfrastructureModule {}
