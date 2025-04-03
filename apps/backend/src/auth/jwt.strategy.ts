import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Algorithm } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const options = {
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: process.env.JWKS_URI ?? '',
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `${process.env.IDP_AUDIENCE}`,
      issuer: `${process.env.IDP_ISSUER}`,
      algorithms: ['RS256' as Algorithm],
    };

    super(options);
  }

  validate(payload: any): any {
    if (!process.env.AUTH0_ROLES_NAME) {
      throw new Error('Missing AUTH0_ROLES_NAME environment variable');
    }

    return {
      userId: payload.sub,
      roles: payload[process.env.AUTH0_ROLES_NAME],
      permissions: payload.permissions,
      email: payload.email,
    };
  }
}
