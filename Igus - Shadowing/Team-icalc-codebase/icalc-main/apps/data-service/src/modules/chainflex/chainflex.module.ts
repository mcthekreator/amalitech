import { Module } from '@nestjs/common';
import { ChainflexPresentationModule } from './presentation';

@Module({
  imports: [ChainflexPresentationModule],
  exports: [ChainflexPresentationModule],
})
export class ChainflexModule {}
