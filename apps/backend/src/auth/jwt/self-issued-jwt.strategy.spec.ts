import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SelfIssuedJwtStrategy } from './self-issued-jwt.strategy';
import { JwtPayload } from './jwt.service';
import { Role } from '../enums/roles.enum';
import * as fs from 'fs';
import * as crypto from 'crypto';

// Generate test RSA keys
const { publicKey: testPublicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('SelfIssuedJwtStrategy', () => {
  let strategy: SelfIssuedJwtStrategy;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        const config: Record<string, string> = {
          JWT_ISSUER: 'https://test-api.example.com',
          JWT_PUBLIC_KEY_PATH: './keys/public.pem',
        };
        return config[key];
      }),
    };

    mockedFs.readFileSync.mockReturnValue(testPublicKey);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SelfIssuedJwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<SelfIssuedJwtStrategy>(SelfIssuedJwtStrategy);
  });

  describe('constructor', () => {
    it('should read public key from configured path', () => {
      expect(mockedFs.readFileSync).toHaveBeenCalled();
    });

    it('should use default issuer when not configured', async () => {
      const configWithoutIssuer = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'JWT_PUBLIC_KEY_PATH') return './keys/public.pem';
          return undefined;
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          SelfIssuedJwtStrategy,
          { provide: ConfigService, useValue: configWithoutIssuer },
        ],
      }).compile();

      // Should not throw - uses default issuer
      expect(module.get(SelfIssuedJwtStrategy)).toBeDefined();
    });

    it('should not throw when key file is missing', async () => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file');
      });

      // Should not throw - uses placeholder key
      const module = await Test.createTestingModule({
        providers: [
          SelfIssuedJwtStrategy,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      expect(module.get(SelfIssuedJwtStrategy)).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should return ValidatedUser from JWT payload', () => {
      const payload: JwtPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        accountId: 'account-456',
        role: Role.ADMIN,
        iss: 'https://test-api.example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        accountId: 'account-456',
        role: Role.ADMIN,
      });
    });

    it('should extract userId from sub claim', () => {
      const payload: JwtPayload = {
        sub: 'specific-user-id',
        email: 'user@test.com',
        accountId: 'acc-1',
        role: Role.VIEWER,
        iss: 'issuer',
        iat: 0,
        exp: 0,
      };

      const result = strategy.validate(payload);

      expect(result.userId).toBe('specific-user-id');
    });

    it('should preserve all role values', () => {
      const roles = [Role.ADMIN, Role.MANAGER, Role.AUTHOR, Role.VIEWER];

      roles.forEach((role) => {
        const payload: JwtPayload = {
          sub: 'user',
          email: 'test@test.com',
          accountId: 'acc',
          role,
          iss: 'issuer',
          iat: 0,
          exp: 0,
        };

        const result = strategy.validate(payload);
        expect(result.role).toBe(role);
      });
    });

    it('should handle payload with special characters in email', () => {
      const payload: JwtPayload = {
        sub: 'user-123',
        email: 'user+tag@example.com',
        accountId: 'account-456',
        role: Role.ADMIN,
        iss: 'issuer',
        iat: 0,
        exp: 0,
      };

      const result = strategy.validate(payload);

      expect(result.email).toBe('user+tag@example.com');
    });
  });
});
