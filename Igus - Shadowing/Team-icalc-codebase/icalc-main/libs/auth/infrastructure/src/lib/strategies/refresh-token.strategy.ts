import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getEnvironment } from '../environment';
import type { Request as Req } from 'express';
import { Strategy } from 'passport-jwt';

import { cookieExtractor } from '@igus/icalc-common';
import type { JwtPayload, JwtPayloadWithRt } from '@igus/icalc-domain';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (request: Req) => cookieExtractor(request, 'rt'),
      secretOrKey: getEnvironment().auth.rtSecret,
      passReqToCallback: true,
    });
  }

  public validate(req: Req, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = cookieExtractor(req, 'rt')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
