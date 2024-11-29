import { Module } from '@nestjs/common';
import { ConfigurationPresentationModule } from './configuration/configuration-presentation.module';
import { Mat017ItemPresentationModule } from './mat017-item';

@Module({
  imports: [ConfigurationPresentationModule, Mat017ItemPresentationModule],
  exports: [ConfigurationPresentationModule, Mat017ItemPresentationModule],
})
export class ConfigurationsPresentationModule {}
