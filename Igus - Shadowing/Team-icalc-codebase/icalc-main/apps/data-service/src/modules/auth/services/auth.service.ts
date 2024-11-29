import type { AuthDto, AuthTokens, IcalcAuthResponse, IcalcUser, JwtPayload, NewUserDTO } from '@igus/icalc-domain';
import { UserEntity } from '@igus/icalc-entities';
import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import * as bcrypt from 'bcryptjs';
import type { DeleteResult } from 'typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity, ICALC_CONNECTION)
    private readonly userRepository: Repository<IcalcUser>,
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource
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

  public async signIn(dto: AuthDto): Promise<{ tokenPair: AuthTokens; user: Partial<IcalcUser> }> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokenPair = await this.getTokens(user.id, user.email);

    await this.updateRtHash(user.id, tokenPair.refreshToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, hastRt, creationDate, modificationDate, ...rest } = user;

    return { tokenPair, user: rest };
  }

  public async logout(userId: string): Promise<IcalcAuthResponse> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          hastRt: null,
        })
        .where('id = :userId and hash_rt IS NOT NULL', { userId })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException('logout failed');
    }
    return 'logged-out';
  }

  public async findUserByEmail(email: string): Promise<IcalcUser> {
    return this.userRepository.findOne({ where: { email } });
  }

  public async removeUserByEmail(email: string): Promise<DeleteResult> {
    return this.userRepository.delete({ email });
  }

  public async findUserById(id: string): Promise<IcalcUser> {
    return this.userRepository.findOne({ where: { id } });
  }

  public async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.hastRt) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(refreshToken, user.hastRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
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
}
