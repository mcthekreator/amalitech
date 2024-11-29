import { UserEntity } from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { AuthDataAccessService } from './auth-data-access.service';
import { AuthTokenStrategy } from './strategies/auth-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UserEntity], ICALC_CONNECTION)],
  providers: [AuthDataAccessService, AuthTokenStrategy, RefreshTokenStrategy],
  exports: [AuthDataAccessService],
})
export class AuthInfrastructureModule {}
