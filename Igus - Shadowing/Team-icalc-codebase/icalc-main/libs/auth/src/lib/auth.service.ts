import type { AuthTokens, IcalcAuthResponse, IcalcUser, JwtPayload, NewUserDTO } from '@igus/icalc-domain';
import { UserEntity } from '@igus/icalc-entities';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ICALC_CONNECTION } from '../constants/constants';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity, ICALC_CONNECTION)
    private readonly userRepository: Repository<IcalcUser>,
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {}

  public async signUp(dto: NewUserDTO): Promise<IcalcAuthResponse> {
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository
      .save({
        email: dto.email,
        hash,
        firstName: dto.firstName || '',
        lastName: dto.lastName || '',
        role: dto.role || '',
      })
      .catch((error) => {
        if (error.code === '23505') {
          throw new ConflictException('Email already exists');
        }
        throw error;
      });

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRtHash(user.id, tokens.refreshToken);

    return 'signed-up';
  }

  public async findUserByEmail(email: string): Promise<IcalcUser> {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async getTokens(userId: string, email: string): Promise<AuthTokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: getEnvironment().auth.atSecret,
        expiresIn: getEnvironment().auth.atTimeout,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: getEnvironment().auth.rtSecret,
        expiresIn: getEnvironment().auth.rtTimeout,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);

    await this.dataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        hastRt: hash,
      })
      .where('id = :userId', { userId })
      .execute();
  }
}
