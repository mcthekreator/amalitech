import type { IcalcAuthResponse, IcalcUser, AuthTokens } from '@igus/icalc-domain';
import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { AuthDto, NewUserDTO } from '../../presentation/dtos';
import { AuthDataAccessService } from '@igus/icalc-auth-infrastructure';

@Injectable()
export class AuthService {
  constructor(private readonly authDataAccessService: AuthDataAccessService) {}

  public async signUp(dto: NewUserDTO): Promise<IcalcAuthResponse> {
    const { email, password, firstName, lastName, role } = dto;

    const hash = await this.authDataAccessService.createHash(password);
    const user = await this.authDataAccessService.createUser(email, hash, firstName, lastName, role);

    const tokens = await this.authDataAccessService.getTokens(user.id, user.email);

    await this.authDataAccessService.updateRtHash(user.id, tokens.refreshToken);

    return 'signed-up';
  }

  public async signIn(dto: AuthDto): Promise<{ tokenPair: AuthTokens; user: Partial<IcalcUser> }> {
    const user = await this.authDataAccessService.findUserByEmail(dto.email);

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const passwordMatches = await this.authDataAccessService.compareHashes(dto.password, user.hash);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokenPair = await this.authDataAccessService.getTokens(user.id, user.email);

    await this.authDataAccessService.updateRtHash(user.id, tokenPair.refreshToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, hastRt, creationDate, modificationDate, ...rest } = user;

    return { tokenPair, user: rest };
  }

  public async getUserProfile(userId: string): Promise<IcalcUser> {
    return this.authDataAccessService.findUserById(userId);
  }

  public async logout(userId: string): Promise<IcalcAuthResponse> {
    try {
      await this.authDataAccessService.updateUser(userId, { hastRt: null });
    } catch (error) {
      throw new InternalServerErrorException('logout failed');
    }
    return 'logged-out';
  }

  public async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.authDataAccessService.findUserById(userId);

    if (!user || !user.hastRt) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await this.authDataAccessService.compareHashes(refreshToken, user.hastRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.authDataAccessService.getTokens(user.id, user.email);

    await this.authDataAccessService.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
