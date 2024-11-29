import { Module } from '@nestjs/common';
import { ConfigurationsApplicationModule } from '@igus/icalc-configurations-application';
import { Mat017ItemController } from './controllers/mat017-item.controller';
import { Mat017RequestMappersService } from './controllers';
import { Mat017ItemInfrastructureModule } from '@igus/icalc-configurations-infrastructure';

@Module({
  imports: [ConfigurationsApplicationModule, Mat017ItemInfrastructureModule],
  controllers: [Mat017ItemController],
  providers: [Mat017RequestMappersService],
})
export class Mat017ItemPresentationModule {}
