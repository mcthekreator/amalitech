import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger';
import { ChainflexApplicationModule } from '../chainflex/application/chainflex-application.module';
import { AkeneoController } from './controllers/akeneo.controller';

import { AkeneoService } from './services/akeneo.service';
import { ValidationService } from './services/validation.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AkeneoController],
  providers: [AkeneoService, ValidationService],
  exports: [AkeneoService],
  imports: [LoggerModule, ChainflexApplicationModule, HttpModule],
})
export class AkeneoModule {}
