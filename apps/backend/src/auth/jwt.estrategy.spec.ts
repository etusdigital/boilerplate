import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    process.env.AUTH0_ROLES_NAME = 'https://bri.us/roles';
    process.env.JWKS_URI = 'https://test.auth0.com/.well-known/jwks.json';
    process.env.IDP_AUDIENCE = 'test-audience';
    process.env.IDP_ISSUER = 'https://test.auth0.com/';

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, PassportModule],
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return transformed user object', () => {
      const mockPayload = {
        'https://bri.us/roles': ['admin'],
        iss: 'https://test.auth0.com/',
        sub: 'auth0|123456',
        aud: ['test-audience'],
        iat: 1234567890,
        exp: 1234567890,
        scope: 'email openid profile',
        azp: 'test-client',
        permissions: ['read:users'],
        email: 'test@example.com',
        identities: ['auth0|123456'],
      };

      const result = jwtStrategy.validate(mockPayload);
      expect(result).toEqual({
        userId: 'auth0|123456',
        roles: ['admin'],
        permissions: ['read:users'],
        email: 'test@example.com',
        identities: ['auth0|123456'],
      });
    });

    it('should throw error when AUTH0_ROLES_NAME is missing', () => {
      const originalEnv = process.env.AUTH0_ROLES_NAME;
      delete process.env.AUTH0_ROLES_NAME;

      const mockPayload = {
        'https://bri.us/roles': ['admin'],
        iss: 'https://test.auth0.com/',
        sub: 'auth0|123456',
        aud: ['test-audience'],
        iat: 1234567890,
        exp: 1234567890,
        scope: 'email openid profile',
        azp: 'test-client',
        permissions: ['read:users'],
        email: 'test@example.com',
        identities: ['auth0|123456'],
      };

      expect(() => jwtStrategy.validate(mockPayload)).toThrow('Missing AUTH0_ROLES_NAME environment variable');

      process.env.AUTH0_ROLES_NAME = originalEnv;
    });
  });
});
