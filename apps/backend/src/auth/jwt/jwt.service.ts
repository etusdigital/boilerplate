import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../../entities/user.entity';
import { Role } from '../enums/roles.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  accountId: string;
  role: Role;
  iss: string;
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class JwtTokenService implements OnModuleInit {
  private privateKey: string | null = null;
  private publicKey: string | null = null;
  private readonly issuer: string;
  private readonly expiresIn: string;

  constructor(private config: ConfigService) {
    this.issuer = config.get<string>('JWT_ISSUER') || 'https://api.boilerplate.local';
    this.expiresIn = config.get<string>('JWT_EXPIRES_IN') || '1h';
  }

  onModuleInit() {
    this.loadKeys();
  }

  private loadKeys(): void {
    const privateKeyPath = this.config.get<string>('JWT_PRIVATE_KEY_PATH');
    const publicKeyPath = this.config.get<string>('JWT_PUBLIC_KEY_PATH');

    if (privateKeyPath && publicKeyPath) {
      try {
        const basePath = process.cwd();
        this.privateKey = fs.readFileSync(
          path.resolve(basePath, privateKeyPath),
          'utf8',
        );
        this.publicKey = fs.readFileSync(
          path.resolve(basePath, publicKeyPath),
          'utf8',
        );
      } catch (error) {
        console.warn(
          'RSA keys not found. Self-issued JWT will not be available.',
          'Run `npm run generate:keys` to create RSA key pair.',
        );
      }
    }
  }

  /**
   * Check if self-issued JWT is available (keys loaded)
   */
  isAvailable(): boolean {
    return this.privateKey !== null && this.publicKey !== null;
  }

  /**
   * Get the public key for external verification
   */
  getPublicKey(): string {
    if (!this.publicKey) {
      throw new Error('Public key not loaded. Run `npm run generate:keys`.');
    }
    return this.publicKey;
  }

  /**
   * Generate a JWT access token for a user
   *
   * @param user - The user to generate token for
   * @param accountId - The account context
   * @param role - User's role in this account
   * @returns Signed JWT access token
   */
  generateAccessToken(user: User, accountId: string, role: Role): string {
    if (!this.privateKey) {
      throw new Error('Private key not loaded. Run `npm run generate:keys`.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      accountId,
      role,
    };

    return jwt.sign(payload, this.privateKey!, {
      algorithm: 'RS256',
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
      issuer: this.issuer,
    });
  }

  /**
   * Generate a refresh token (longer lived)
   *
   * @param user - The user to generate token for
   * @returns Signed JWT refresh token
   */
  generateRefreshToken(user: User): string {
    if (!this.privateKey) {
      throw new Error('Private key not loaded. Run `npm run generate:keys`.');
    }

    const payload = {
      sub: user.id,
      type: 'refresh',
    };

    return jwt.sign(payload, this.privateKey!, {
      algorithm: 'RS256',
      expiresIn: '7d' as jwt.SignOptions['expiresIn'],
      issuer: this.issuer,
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  generateTokenPair(user: User, accountId: string, role: Role): TokenPair {
    return {
      accessToken: this.generateAccessToken(user, accountId, role),
      refreshToken: this.generateRefreshToken(user),
      expiresIn: this.parseExpiresIn(this.expiresIn),
    };
  }

  /**
   * Verify a JWT token signed by this service
   *
   * @param token - JWT to verify
   * @returns Decoded payload
   * @throws Error if token is invalid or expired
   */
  verifyToken(token: string): JwtPayload {
    if (!this.publicKey) {
      throw new Error('Public key not loaded. Run `npm run generate:keys`.');
    }

    return jwt.verify(token, this.publicKey, {
      algorithms: ['RS256'],
      issuer: this.issuer,
    }) as JwtPayload;
  }

  /**
   * Decode a JWT without verification (for debugging)
   */
  decodeToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // default 1h

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600;
    }
  }
}
