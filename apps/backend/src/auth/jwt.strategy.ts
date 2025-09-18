import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Algorithm } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

interface Auth0JWT {
  'https://bri.us/roles': string[];
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  scope: string;
  azp: string;
  permissions: string[];
  identities: string[];
  email: string;
}

interface Auth0User {
  userId: string;
  roles: string[];
  permissions: string[];
  email: string;
  identities: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const options = {
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: configService.get<string>('JWKS_URI')!,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('IDP_AUDIENCE'),
      issuer: configService.get<string>('IDP_ISSUER'),
      algorithms: ['RS256' as Algorithm],
    };

    super(options);
  }

  validate(payload: Auth0JWT): Auth0User {
    if (!this.configService.get<string>('AUTH0_ROLES_NAME')) {
      throw new Error('Missing AUTH0_ROLES_NAME environment variable');
    }

    const userId = payload.sub;
    const roles = payload[this.configService.get<string>('AUTH0_ROLES_NAME')!] as string[];
    const permissions = payload.permissions;
    const email = payload.email;
    const identities = payload.identities;

    return {
      userId,
      roles,
      permissions,
      email,
      identities,
    };
  }
}
