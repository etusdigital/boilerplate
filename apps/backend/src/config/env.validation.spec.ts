import { envSchema, validateEnv, EnvConfig } from './env.validation';

describe('Environment Validation', () => {
  // Minimal valid config with all required fields
  const validConfig = {
    JWKS_URI: 'https://example.auth0.com/.well-known/jwks.json',
    IDP_ISSUER: 'https://example.auth0.com/',
    IDP_AUDIENCE: 'https://api.example.com',
    AUTH0_DOMAIN: 'example.auth0.com',
    AUTH0_CLIENT_ID: 'client-id-123',
    AUTH0_CLIENT_SECRET: 'client-secret-456',
  };

  describe('envSchema', () => {
    describe('valid configurations', () => {
      it('should pass with all required fields', () => {
        const result = envSchema.safeParse(validConfig);
        expect(result.success).toBe(true);
      });

      it('should pass with all optional fields', () => {
        const fullConfig = {
          ...validConfig,
          NODE_ENV: 'production',
          PORT: 8080,
          DATABASE_URL: 'postgres://localhost:5432/db',
          TYPEORM_LOGGING: 'true',
          AUTH0_ROLES_NAME: 'https://example.com/roles',
          AUTH0_CONNECTION_ID: 'con_abc123',
          AUTH0_CONNECTION_TYPE: 'google-oauth2',
          SERVICE_ACCOUNT: '{"key": "value"}',
          FRONTEND_URL: 'https://app.example.com',
          ALLOWED_ORIGINS: 'https://app.example.com,https://admin.example.com',
          GOOGLE_CLIENT_ID: 'google-client-id',
          GOOGLE_CLIENT_SECRET: 'google-client-secret',
          JWT_ISSUER: 'https://api.example.com',
          JWT_PRIVATE_KEY_PATH: './keys/private.pem',
          JWT_PUBLIC_KEY_PATH: './keys/public.pem',
          JWT_EXPIRES_IN: '2h',
          REDIS_URL: 'redis://localhost:6379',
          REDIS_HOST: 'redis.example.com',
          REDIS_PORT: '6380',
          REDIS_PASSWORD: 'secret',
        };

        const result = envSchema.safeParse(fullConfig);
        expect(result.success).toBe(true);
      });
    });

    describe('default values', () => {
      it('should default NODE_ENV to development', () => {
        const result = envSchema.parse(validConfig);
        expect(result.NODE_ENV).toBe('development');
      });

      it('should default PORT to 3000', () => {
        const result = envSchema.parse(validConfig);
        expect(result.PORT).toBe(3000);
      });

      it('should default TYPEORM_LOGGING to false', () => {
        const result = envSchema.parse(validConfig);
        expect(result.TYPEORM_LOGGING).toBe(false);
      });

      it('should default AUTH0_CONNECTION_TYPE to Username-Password-Authentication', () => {
        const result = envSchema.parse(validConfig);
        expect(result.AUTH0_CONNECTION_TYPE).toBe(
          'Username-Password-Authentication',
        );
      });

      it('should default ALLOWED_ORIGINS to ["*"]', () => {
        const result = envSchema.parse(validConfig);
        expect(result.ALLOWED_ORIGINS).toEqual(['*']);
      });

      it('should default JWT_EXPIRES_IN to 1h', () => {
        const result = envSchema.parse(validConfig);
        expect(result.JWT_EXPIRES_IN).toBe('1h');
      });

      it('should default REDIS_HOST to localhost', () => {
        const result = envSchema.parse(validConfig);
        expect(result.REDIS_HOST).toBe('localhost');
      });

      it('should default REDIS_PORT to 6379', () => {
        const result = envSchema.parse(validConfig);
        expect(result.REDIS_PORT).toBe(6379);
      });
    });

    describe('type coercion', () => {
      it('should coerce PORT from string to number', () => {
        const config = { ...validConfig, PORT: '8080' };
        const result = envSchema.parse(config);
        expect(result.PORT).toBe(8080);
        expect(typeof result.PORT).toBe('number');
      });

      it('should coerce REDIS_PORT from string to number', () => {
        const config = { ...validConfig, REDIS_PORT: '6380' };
        const result = envSchema.parse(config);
        expect(result.REDIS_PORT).toBe(6380);
        expect(typeof result.REDIS_PORT).toBe('number');
      });
    });

    describe('transforms', () => {
      it('should transform TYPEORM_LOGGING "true" to boolean true', () => {
        const config = { ...validConfig, TYPEORM_LOGGING: 'true' };
        const result = envSchema.parse(config);
        expect(result.TYPEORM_LOGGING).toBe(true);
      });

      it('should transform TYPEORM_LOGGING "false" to boolean false', () => {
        const config = { ...validConfig, TYPEORM_LOGGING: 'false' };
        const result = envSchema.parse(config);
        expect(result.TYPEORM_LOGGING).toBe(false);
      });

      it('should transform TYPEORM_LOGGING any other value to false', () => {
        const config = { ...validConfig, TYPEORM_LOGGING: 'yes' };
        const result = envSchema.parse(config);
        expect(result.TYPEORM_LOGGING).toBe(false);
      });

      it('should transform ALLOWED_ORIGINS comma-separated string to array', () => {
        const config = {
          ...validConfig,
          ALLOWED_ORIGINS: 'https://a.com,https://b.com,https://c.com',
        };
        const result = envSchema.parse(config);
        expect(result.ALLOWED_ORIGINS).toEqual([
          'https://a.com',
          'https://b.com',
          'https://c.com',
        ]);
      });

      it('should trim whitespace from ALLOWED_ORIGINS entries', () => {
        const config = {
          ...validConfig,
          ALLOWED_ORIGINS: ' https://a.com , https://b.com , https://c.com ',
        };
        const result = envSchema.parse(config);
        expect(result.ALLOWED_ORIGINS).toEqual([
          'https://a.com',
          'https://b.com',
          'https://c.com',
        ]);
      });
    });

    describe('validation errors', () => {
      it('should fail when JWKS_URI is missing', () => {
        const { JWKS_URI, ...config } = validConfig;
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('JWKS_URI');
        }
      });

      it('should fail when JWKS_URI is not a valid URL', () => {
        const config = { ...validConfig, JWKS_URI: 'not-a-url' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('JWKS_URI');
          expect(result.error.issues[0].message.toLowerCase()).toContain('url');
        }
      });

      it('should fail when IDP_ISSUER is missing', () => {
        const { IDP_ISSUER, ...config } = validConfig;
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when IDP_ISSUER is not a valid URL', () => {
        const config = { ...validConfig, IDP_ISSUER: 'not-a-url' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when IDP_AUDIENCE is missing', () => {
        const { IDP_AUDIENCE, ...config } = validConfig;
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when AUTH0_DOMAIN is missing', () => {
        const { AUTH0_DOMAIN, ...config } = validConfig;
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when AUTH0_DOMAIN is empty string', () => {
        const config = { ...validConfig, AUTH0_DOMAIN: '' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when AUTH0_CLIENT_ID is missing', () => {
        const { AUTH0_CLIENT_ID, ...config } = validConfig;
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when AUTH0_CLIENT_SECRET is missing', () => {
        const { AUTH0_CLIENT_SECRET, ...config } = validConfig;
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when NODE_ENV is invalid', () => {
        const config = { ...validConfig, NODE_ENV: 'invalid' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when FRONTEND_URL is not a valid URL', () => {
        const config = { ...validConfig, FRONTEND_URL: 'not-a-url' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });

      it('should fail when JWT_ISSUER is not a valid URL', () => {
        const config = { ...validConfig, JWT_ISSUER: 'not-a-url' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(false);
      });
    });

    describe('NODE_ENV enum', () => {
      it('should accept "development"', () => {
        const config = { ...validConfig, NODE_ENV: 'development' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(true);
      });

      it('should accept "production"', () => {
        const config = { ...validConfig, NODE_ENV: 'production' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(true);
      });

      it('should accept "test"', () => {
        const config = { ...validConfig, NODE_ENV: 'test' };
        const result = envSchema.safeParse(config);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('validateEnv', () => {
    it('should return validated config on success', () => {
      const result = validateEnv(validConfig);
      expect(result).toBeDefined();
      expect(result.NODE_ENV).toBe('development');
      expect(result.PORT).toBe(3000);
    });

    it('should throw Error with formatted message on validation failure', () => {
      const invalidConfig = { ...validConfig, JWKS_URI: 'invalid' };

      expect(() => validateEnv(invalidConfig)).toThrow(Error);
      expect(() => validateEnv(invalidConfig)).toThrow(
        /Environment validation failed/,
      );
    });

    it('should include field path in error message', () => {
      const invalidConfig = { ...validConfig, JWKS_URI: 'invalid' };

      try {
        validateEnv(invalidConfig);
        fail('Should have thrown');
      } catch (error) {
        expect((error as Error).message).toContain('JWKS_URI');
      }
    });

    it('should include all validation errors in message', () => {
      const invalidConfig = {
        // Missing all required fields
      };

      try {
        validateEnv(invalidConfig);
        fail('Should have thrown');
      } catch (error) {
        const message = (error as Error).message;
        expect(message).toContain('JWKS_URI');
        expect(message).toContain('IDP_ISSUER');
        expect(message).toContain('IDP_AUDIENCE');
        expect(message).toContain('AUTH0_DOMAIN');
        expect(message).toContain('AUTH0_CLIENT_ID');
        expect(message).toContain('AUTH0_CLIENT_SECRET');
      }
    });
  });

  describe('EnvConfig type', () => {
    it('should have correct type inference', () => {
      const config: EnvConfig = envSchema.parse(validConfig);

      // These type assertions verify the types are correct
      const _nodeEnv: 'development' | 'production' | 'test' = config.NODE_ENV;
      const _port: number = config.PORT;
      const _logging: boolean = config.TYPEORM_LOGGING;
      const _origins: string[] = config.ALLOWED_ORIGINS;
      const _optionalUrl: string | undefined = config.DATABASE_URL;

      expect(_nodeEnv).toBeDefined();
      expect(_port).toBeDefined();
      expect(_logging).toBeDefined();
      expect(_origins).toBeDefined();
    });
  });
});
