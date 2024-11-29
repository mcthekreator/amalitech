import { Module } from '@nestjs/common';
import { AuthApplicationModule } from '../application';
import { AuthController } from './controllers';

@Module({
  imports: [AuthApplicationModule],
  exports: [AuthApplicationModule],
  controllers: [AuthController],
})
export class AuthPresentationModule {}
