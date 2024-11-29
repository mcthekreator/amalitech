import { UserEntity } from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '../constants/constants';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UserEntity], ICALC_CONNECTION)],
  controllers: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
