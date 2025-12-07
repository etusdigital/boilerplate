import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService, JwtPayload } from './jwt.service';
import { Role } from '../enums/roles.enum';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as crypto from 'crypto';

// Generate test RSA keys
const { publicKey: testPublicKey, privateKey: testPrivateKey } =
  crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('JwtTokenService', () => {
  let service: JwtTokenService;
  let mockConfigService: Partial<ConfigService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    status: 'accepted',
    providerIds: [],
    isSuperAdmin: false,
    profileImage: null,
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        const config: Record<string, string> = {
          JWT_ISSUER: 'https://test-api.example.com',
          JWT_EXPIRES_IN: '1h',
          JWT_PRIVATE_KEY_PATH: './keys/private.pem',
          JWT_PUBLIC_KEY_PATH: './keys/public.pem',
        };
        return config[key];
      }),
    };

    // Mock file reads to return test keys
    mockedFs.readFileSync.mockImplementation((path: any) => {
      if (path.includes('private')) return testPrivateKey;
      if (path.includes('public')) return testPublicKey;
      throw new Error('File not found');
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokenService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
    service.onModuleInit(); // Load keys
  });

  describe('onModuleInit', () => {
    it('should load keys when paths are configured', () => {
      expect(mockedFs.readFileSync).toHaveBeenCalledTimes(2);
      expect(service.isAvailable()).toBe(true);
    });

    it('should not throw when keys are missing', async () => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file');
      });

      const module = await Test.createTestingModule({
        providers: [
          JwtTokenService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const serviceWithoutKeys = module.get<JwtTokenService>(JwtTokenService);
      expect(() => serviceWithoutKeys.onModuleInit()).not.toThrow();
      expect(serviceWithoutKeys.isAvailable()).toBe(false);
    });
  });

  describe('isAvailable', () => {
    it('should return true when keys are loaded', () => {
      expect(service.isAvailable()).toBe(true);
    });

    it('should return false when keys are not loaded', async () => {
      const configWithoutPaths = {
        get: jest.fn().mockReturnValue(undefined),
      };

      const module = await Test.createTestingModule({
        providers: [
          JwtTokenService,
          { provide: ConfigService, useValue: configWithoutPaths },
        ],
      }).compile();

      const serviceWithoutKeys = module.get<JwtTokenService>(JwtTokenService);
      serviceWithoutKeys.onModuleInit();
      expect(serviceWithoutKeys.isAvailable()).toBe(false);
    });
  });

  describe('getPublicKey', () => {
    it('should return public key when loaded', () => {
      const publicKey = service.getPublicKey();
      expect(publicKey).toBe(testPublicKey);
    });

    it('should throw when public key not loaded', async () => {
      const configWithoutPaths = {
        get: jest.fn().mockReturnValue(undefined),
      };

      const module = await Test.createTestingModule({
        providers: [
          JwtTokenService,
          { provide: ConfigService, useValue: configWithoutPaths },
        ],
      }).compile();

      const serviceWithoutKeys = module.get<JwtTokenService>(JwtTokenService);
      serviceWithoutKeys.onModuleInit();
      expect(() => serviceWithoutKeys.getPublicKey()).toThrow(
        'Public key not loaded',
      );
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JWT token', () => {
      const token = service.generateAccessToken(
        mockUser,
        'account-123',
        Role.ADMIN,
      );

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format
    });

    it('should include correct claims in token', () => {
      const token = service.generateAccessToken(
        mockUser,
        'account-123',
        Role.MANAGER,
      );

      const decoded = jwt.verify(token, testPublicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;

      expect(decoded.sub).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.accountId).toBe('account-123');
      expect(decoded.role).toBe(Role.MANAGER);
      expect(decoded.iss).toBe('https://test-api.example.com');
    });

    it('should throw when private key not loaded', async () => {
      const configWithoutPaths = {
        get: jest.fn().mockReturnValue(undefined),
      };

      const module = await Test.createTestingModule({
        providers: [
          JwtTokenService,
          { provide: ConfigService, useValue: configWithoutPaths },
        ],
      }).compile();

      const serviceWithoutKeys = module.get<JwtTokenService>(JwtTokenService);
      serviceWithoutKeys.onModuleInit();

      expect(() =>
        serviceWithoutKeys.generateAccessToken(
          mockUser,
          'account-123',
          Role.ADMIN,
        ),
      ).toThrow('Private key not loaded');
    });

    it('should use RS256 algorithm', () => {
      const token = service.generateAccessToken(
        mockUser,
        'account-123',
        Role.ADMIN,
      );

      const decoded = jwt.decode(token, { complete: true });
      expect(decoded?.header.alg).toBe('RS256');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = service.generateRefreshToken(mockUser);

      expect(token).toBeDefined();
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include type:refresh in payload', () => {
      const token = service.generateRefreshToken(mockUser);

      const decoded = jwt.verify(token, testPublicKey, {
        algorithms: ['RS256'],
      }) as any;

      expect(decoded.type).toBe('refresh');
      expect(decoded.sub).toBe(mockUser.id);
    });

    it('should have longer expiration than access token', () => {
      const accessToken = service.generateAccessToken(
        mockUser,
        'account-123',
        Role.ADMIN,
      );
      const refreshToken = service.generateRefreshToken(mockUser);

      const accessDecoded = jwt.decode(accessToken) as any;
      const refreshDecoded = jwt.decode(refreshToken) as any;

      // Refresh should expire later than access
      expect(refreshDecoded.exp).toBeGreaterThan(accessDecoded.exp);
    });
  });

  describe('generateTokenPair', () => {
    it('should return both access and refresh tokens', () => {
      const pair = service.generateTokenPair(
        mockUser,
        'account-123',
        Role.ADMIN,
      );

      expect(pair.accessToken).toBeDefined();
      expect(pair.refreshToken).toBeDefined();
      expect(pair.expiresIn).toBeDefined();
    });

    it('should include expiresIn in seconds', () => {
      const pair = service.generateTokenPair(
        mockUser,
        'account-123',
        Role.ADMIN,
      );

      // 1h = 3600 seconds
      expect(pair.expiresIn).toBe(3600);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode valid token', () => {
      const token = service.generateAccessToken(
        mockUser,
        'account-123',
        Role.ADMIN,
      );

      const payload = service.verifyToken(token);

      expect(payload.sub).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
    });

    it('should throw for expired token', () => {
      // Create token that's already expired
      const expiredToken = jwt.sign(
        { sub: mockUser.id, email: mockUser.email },
        testPrivateKey,
        {
          algorithm: 'RS256',
          expiresIn: '-1h', // Already expired
          issuer: 'https://test-api.example.com',
        },
      );

      expect(() => service.verifyToken(expiredToken)).toThrow();
    });

    it('should throw for token with wrong issuer', () => {
      const wrongIssuerToken = jwt.sign(
        { sub: mockUser.id, email: mockUser.email },
        testPrivateKey,
        {
          algorithm: 'RS256',
          expiresIn: '1h',
          issuer: 'https://wrong-issuer.com',
        },
      );

      expect(() => service.verifyToken(wrongIssuerToken)).toThrow();
    });

    it('should throw for tampered token', () => {
      const token = service.generateAccessToken(
        mockUser,
        'account-123',
        Role.ADMIN,
      );

      // Tamper with the token
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => service.verifyToken(tamperedToken)).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const token = service.generateAccessToken(
        mockUser,
        'account-123',
        Role.ADMIN,
      );

      const decoded = service.decodeToken(token);

      expect(decoded?.sub).toBe(mockUser.id);
    });

    it('should return null for invalid token format', () => {
      const decoded = service.decodeToken('not-a-valid-jwt');

      expect(decoded).toBeNull();
    });
  });

  describe('parseExpiresIn', () => {
    it('should parse seconds correctly', async () => {
      const configWith30s = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'JWT_EXPIRES_IN') return '30s';
          if (key === 'JWT_PRIVATE_KEY_PATH') return './keys/private.pem';
          if (key === 'JWT_PUBLIC_KEY_PATH') return './keys/public.pem';
          return undefined;
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          JwtTokenService,
          { provide: ConfigService, useValue: configWith30s },
        ],
      }).compile();

      const serviceWith30s = module.get<JwtTokenService>(JwtTokenService);
      serviceWith30s.onModuleInit();

      const pair = serviceWith30s.generateTokenPair(
        mockUser,
        'account-123',
        Role.ADMIN,
      );
      expect(pair.expiresIn).toBe(30);
    });

    it('should parse minutes correctly', async () => {
      const configWith5m = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'JWT_EXPIRES_IN') return '5m';
          if (key === 'JWT_PRIVATE_KEY_PATH') return './keys/private.pem';
          if (key === 'JWT_PUBLIC_KEY_PATH') return './keys/public.pem';
          return undefined;
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          JwtTokenService,
          { provide: ConfigService, useValue: configWith5m },
        ],
      }).compile();

      const serviceWith5m = module.get<JwtTokenService>(JwtTokenService);
      serviceWith5m.onModuleInit();

      const pair = serviceWith5m.generateTokenPair(
        mockUser,
        'account-123',
        Role.ADMIN,
      );
      expect(pair.expiresIn).toBe(300); // 5 * 60
    });

    it('should parse days correctly', async () => {
      const configWith2d = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'JWT_EXPIRES_IN') return '2d';
          if (key === 'JWT_PRIVATE_KEY_PATH') return './keys/private.pem';
          if (key === 'JWT_PUBLIC_KEY_PATH') return './keys/public.pem';
          return undefined;
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          JwtTokenService,
          { provide: ConfigService, useValue: configWith2d },
        ],
      }).compile();

      const serviceWith2d = module.get<JwtTokenService>(JwtTokenService);
      serviceWith2d.onModuleInit();

      const pair = serviceWith2d.generateTokenPair(
        mockUser,
        'account-123',
        Role.ADMIN,
      );
      expect(pair.expiresIn).toBe(172800); // 2 * 86400
    });
  });
});
