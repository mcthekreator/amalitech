import { ChainflexEntity, ChainflexPriceEntity } from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { ChainflexDataAccessService } from './chainflex-data-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChainflexEntity, ChainflexPriceEntity], ICALC_CONNECTION)],
  providers: [ChainflexDataAccessService],
  exports: [ChainflexDataAccessService, TypeOrmModule],
})
export class ChainflexInfrastructureModule {}
