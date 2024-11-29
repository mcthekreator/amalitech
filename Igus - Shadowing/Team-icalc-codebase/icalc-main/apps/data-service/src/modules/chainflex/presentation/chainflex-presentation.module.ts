import { Module } from '@nestjs/common';
import { ChainflexApplicationModule } from '../application';
import { ChainflexController } from './controllers/chainflex.controller';

@Module({
  imports: [ChainflexApplicationModule],
  controllers: [ChainflexController],
  exports: [ChainflexApplicationModule],
})
export class ChainflexPresentationModule {}
