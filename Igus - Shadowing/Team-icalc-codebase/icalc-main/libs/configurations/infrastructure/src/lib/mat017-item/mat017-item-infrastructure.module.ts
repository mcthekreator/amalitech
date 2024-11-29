import { Mat017ItemEntity, Mat017ItemUsageEntity } from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { Mat017ItemDataAccessService } from './mat017-item-data-access.service';
import { Mat017ItemUpdateService } from './mat017-item-update.service';
import { Mat017ItemUsageDataAccessService } from './mat017-item-usage-data-access.service';
import { Mat017ItemParsingService } from './mat017-item-parsing.service';
import { Mat017InfrastructureModuleLogger } from './logger.service';
import { Mat017ItemIerpService } from './mat017-item-ierp.service';
import { HttpModule } from '@nestjs/axios';
import { Mat017ItemWidenService } from './mat017-item-widen.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mat017ItemEntity, Mat017ItemUsageEntity], ICALC_CONNECTION), HttpModule],
  providers: [
    Mat017ItemDataAccessService,
    Mat017ItemUpdateService,
    Mat017ItemParsingService,
    Mat017ItemUsageDataAccessService,
    Mat017ItemIerpService,
    Mat017InfrastructureModuleLogger,
    Mat017ItemWidenService,
  ],
  exports: [
    Mat017ItemDataAccessService,
    Mat017ItemUpdateService,
    Mat017ItemUsageDataAccessService,
    Mat017ItemParsingService,
    Mat017ItemIerpService,
    Mat017ItemWidenService,
    TypeOrmModule,
  ],
})
export class Mat017ItemInfrastructureModule {}
