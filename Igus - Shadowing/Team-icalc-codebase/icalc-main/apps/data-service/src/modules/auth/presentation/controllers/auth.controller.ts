import type { IcalcAuthResponse } from '@igus/icalc-domain';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Get,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import type { CookieOptions } from 'express';
import { Response as Res } from 'express';

import { GetCurrentUser, GetCurrentUserId, Public } from '../../../shared/decorators';
import { RefreshTokenGuard } from '../../../shared/guards';
import { AuthDto } from '@igus/icalc-domain';
import { AuthService } from '../../application';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;
  constructor(private readonly authService: AuthService) {
    this.cookieOptions = { secure: getEnvironment().env !== 'development', httpOnly: true };
  }

  // @Public()
  // @Post('signup')
  // @HttpCode(HttpStatus.CREATED)
  // signupLocal(@Body() dto: NewUserDTO): Promise<IcalcAuthResponse> {
  //   return this.authService.signUp(dto);
  // }

  // @Public()
  // @Post('delete-account')
  // @HttpCode(HttpStatus.OK)
  // async signupLocal(@Body() data: { email: string }): Promise<IcalcAuthResponse> {
  //   const result = await this.authService.removeUserByEmail(data.email);
  //   return result === 1 ? 'user-deleted' : 'failed';
  // }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() dto: AuthDto, @Response() response: Res): Promise<Res<unknown, Record<string, unknown>>> {
    const signInResult = await this.authService.signIn(dto);

    if (!signInResult.tokenPair || !signInResult.user) {
      throw new InternalServerErrorException('failed' as IcalcAuthResponse);
    }
    return response
      .cookie('at', signInResult.tokenPair.accessToken, this.cookieOptions)
      .cookie('rt', signInResult.tokenPair.refreshToken, this.cookieOptions)
      .json({ user: signInResult.user });
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  public async profile(
    @GetCurrentUserId() userId: string,
    @Response() response: Res
  ): Promise<Res<unknown, Record<string, unknown>>> {
    const result = await this.authService.getUserProfile(userId);

    if (!result) {
      throw new InternalServerErrorException('failed' as IcalcAuthResponse);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, hastRt, creationDate, modificationDate, ...user } = result;

    return response.json(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public logout(@GetCurrentUserId() userId: string, @Response() response: Res): Res<unknown, Record<string, unknown>> {
    const result = this.authService.logout(userId);

    if (!result) {
      throw new InternalServerErrorException('failed' as IcalcAuthResponse);
    }
    response.cookie('at', '', { expires: new Date(0) }).cookie('rt', '', { expires: new Date(0) });
    return response.json(result);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Response() response: Res
  ): Promise<Res<unknown, Record<string, unknown>>> {
    const tokenPair = await this.authService.refreshTokens(userId, refreshToken);

    if (!tokenPair) {
      throw new InternalServerErrorException('failed' as IcalcAuthResponse);
    }
    return response
      .cookie('at', tokenPair.accessToken, this.cookieOptions)
      .cookie('rt', tokenPair.refreshToken, this.cookieOptions)
      .json('refreshed' as IcalcAuthResponse);
  }
}
