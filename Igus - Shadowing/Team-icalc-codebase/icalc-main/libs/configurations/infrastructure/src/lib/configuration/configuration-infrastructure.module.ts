import { ConfigurationEntity, ConfigurationSnapshotEntity } from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { ConfigurationDataAccessService } from './configuration-data-access.service';
import { ConfigurationSnapshotDataAccessService } from './configuration-snapshot-data-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigurationEntity, ConfigurationSnapshotEntity], ICALC_CONNECTION)],
  providers: [ConfigurationDataAccessService, ConfigurationSnapshotDataAccessService],
  exports: [ConfigurationDataAccessService, ConfigurationSnapshotDataAccessService, TypeOrmModule],
})
export class ConfigurationInfrastructureModule {}
