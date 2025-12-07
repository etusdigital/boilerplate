import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import * as path from 'path';
import { JwtPayload } from './jwt.service';

interface ValidatedUser {
  userId: string;
  email: string;
  accountId: string;
  role: string;
}

/**
 * Passport strategy for validating self-issued JWTs (RS256).
 * Used when the application manages its own tokens instead of Auth0.
 */
@Injectable()
export class SelfIssuedJwtStrategy extends PassportStrategy(
  Strategy,
  'self-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    const publicKeyPath = configService.get<string>('JWT_PUBLIC_KEY_PATH');
    const issuer =
      configService.get<string>('JWT_ISSUER') ||
      'https://api.boilerplate.local';

    let publicKey: string | undefined;
    if (publicKeyPath) {
      try {
        const basePath = process.cwd();
        publicKey = fs.readFileSync(
          path.resolve(basePath, publicKeyPath),
          'utf8',
        );
      } catch {
        // Keys not available - strategy will fail validation
      }
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey || 'placeholder-key-will-fail',
      algorithms: ['RS256'],
      issuer,
    });
  }

  /**
   * Validate the decoded JWT payload and return the user object
   * that will be attached to the request.
   */
  validate(payload: JwtPayload): ValidatedUser {
    return {
      userId: payload.sub,
      email: payload.email,
      accountId: payload.accountId,
      role: payload.role,
    };
  }
}
