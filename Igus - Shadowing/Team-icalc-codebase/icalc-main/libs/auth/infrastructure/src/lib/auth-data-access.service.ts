import type { AuthTokens, IcalcUser, JwtPayload } from '@igus/icalc-domain';
import { UserEntity } from '@igus/icalc-entities';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { getEnvironment } from './environment';
import * as bcrypt from 'bcryptjs';
import type { UpdateResult, DeleteResult } from 'typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthDataAccessService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity, ICALC_CONNECTION)
    private readonly userRepository: Repository<IcalcUser>,
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource
  ) {}

  public async createUser(
    email: string,
    hash: string,
    firstName: string,
    lastName: string,
    role: string
  ): Promise<IcalcUser> {
    return this.userRepository
      .save({
        email,
        hash,
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || '',
      })
      .catch((error) => {
        if (error.code === '23505') {
          throw new ConflictException('Email already exists');
        }
        throw error;
      });
  }

  public async updateUser(userId: string, userData: Partial<IcalcUser>): Promise<UpdateResult> {
    return this.dataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        ...userData,
      })
      .where('id = :userId and hash_rt IS NOT NULL', { userId })
      .execute();
  }

  public async createHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async compareHashes(password, userHash: string): Promise<boolean> {
    return bcrypt.compare(password, userHash);
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

  public async getUserAsStringById(id: string): Promise<string> {
    const fullUser = await this.findUserById(id);

    return `${fullUser.firstName} ${fullUser.lastName}`;
  }

  public async updateRtHash(userId: string, rt: string): Promise<void> {
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

  public async getTokens(userId: string, email: string): Promise<AuthTokens> {
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
