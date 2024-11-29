import { Module } from '@nestjs/common';
import { Mat017ItemInfrastructureModule } from '@igus/icalc-configurations-infrastructure';
import { Mat017ItemService } from './services';

@Module({
  imports: [Mat017ItemInfrastructureModule],
  providers: [Mat017ItemService],
  exports: [Mat017ItemService],
})
export class Mat017ItemApplicationModule {}
