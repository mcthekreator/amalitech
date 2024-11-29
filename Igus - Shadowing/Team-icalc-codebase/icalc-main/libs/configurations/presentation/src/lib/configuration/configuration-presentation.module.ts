import { Module } from '@nestjs/common';
import { ConfigurationsApplicationModule } from '@igus/icalc-configurations-application';
import { ConfigurationController } from './controllers/configuration.controller';
import { ConfigurationsPresentationMapperService } from './controllers/configuration-response-mapper.service';

@Module({
  imports: [ConfigurationsApplicationModule],
  controllers: [ConfigurationController],
  providers: [ConfigurationsPresentationMapperService],
})
export class ConfigurationPresentationModule {}
