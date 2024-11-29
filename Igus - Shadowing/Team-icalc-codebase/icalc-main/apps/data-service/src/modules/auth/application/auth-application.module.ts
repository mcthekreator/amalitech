import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '@igus/icalc-auth-infrastructure';
import { AuthService } from './services';

@Module({
  imports: [AuthInfrastructureModule],
  providers: [AuthService],
  exports: [AuthService, AuthInfrastructureModule],
})
export class AuthApplicationModule {}
