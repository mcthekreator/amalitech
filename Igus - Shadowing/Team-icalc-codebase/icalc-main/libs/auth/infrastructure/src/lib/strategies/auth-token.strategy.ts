import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request as Req } from 'express';
import { Strategy } from 'passport-jwt';

import { cookieExtractor } from '@igus/icalc-common';
import type { JwtPayload } from '@igus/icalc-domain';
import { getEnvironment } from '../environment';

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (request: Req) => cookieExtractor(request, 'at'),
      secretOrKey: getEnvironment().auth.atSecret,
    });
  }

  public validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
