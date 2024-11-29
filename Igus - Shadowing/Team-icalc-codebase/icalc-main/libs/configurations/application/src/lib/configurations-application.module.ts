import { Module } from '@nestjs/common';
import { ConfigurationApplicationModule } from './configuration/configuration-application.module';
import { Mat017ItemApplicationModule } from './mat017-item';

@Module({
  imports: [ConfigurationApplicationModule, Mat017ItemApplicationModule],
  exports: [ConfigurationApplicationModule, Mat017ItemApplicationModule],
})
export class ConfigurationsApplicationModule {}
