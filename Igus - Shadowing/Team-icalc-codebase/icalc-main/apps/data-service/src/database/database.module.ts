import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RepositoryService } from './repository';

const services = [DatabaseService, RepositoryService];

@Module({
  providers: services,
  exports: services,
})
export class DatabaseModule {}
