import { Module } from '@nestjs/common';
import { AuthPresentationModule } from './presentation';

@Module({
  imports: [AuthPresentationModule],
  exports: [AuthPresentationModule],
})
export class AuthModule {}
