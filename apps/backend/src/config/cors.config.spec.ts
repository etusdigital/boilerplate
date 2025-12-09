import {
  getCorsOrigins,
  createCorsOriginCallback,
  corsOptions,
  CorsOrigins,
} from './cors.config';

describe('CORS Configuration', () => {
  describe('getCorsOrigins', () => {
    const originalEnv = process.env.ALLOWED_ORIGINS;

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env.ALLOWED_ORIGINS;
      } else {
        process.env.ALLOWED_ORIGINS = originalEnv;
      }
    });

    it('should return "*" when env value is "*"', () => {
      const result = getCorsOrigins('*');
      expect(result).toBe('*');
    });

    it('should return "*" when env value is undefined and env var not set', () => {
      delete process.env.ALLOWED_ORIGINS;
      const result = getCorsOrigins();
      expect(result).toBe('*');
    });

    it('should return array when env value is comma-separated origins', () => {
      const result = getCorsOrigins('https://a.com,https://b.com');
      expect(result).toEqual(['https://a.com', 'https://b.com']);
    });

    it('should trim whitespace from origins', () => {
      const result = getCorsOrigins(' https://a.com , https://b.com ');
      expect(result).toEqual(['https://a.com', 'https://b.com']);
    });

    it('should return single-item array for single origin', () => {
      const result = getCorsOrigins('https://app.example.com');
      expect(result).toEqual(['https://app.example.com']);
    });

    it('should read from process.env.ALLOWED_ORIGINS when no param provided', () => {
      process.env.ALLOWED_ORIGINS = 'https://from-env.com';
      const result = getCorsOrigins();
      expect(result).toEqual(['https://from-env.com']);
    });

    it('should prefer parameter over environment variable', () => {
      process.env.ALLOWED_ORIGINS = 'https://from-env.com';
      const result = getCorsOrigins('https://from-param.com');
      expect(result).toEqual(['https://from-param.com']);
    });
  });

  describe('createCorsOriginCallback', () => {
    describe('with wildcard origins', () => {
      const callback = createCorsOriginCallback('*');

      it('should allow requests with no origin', (done) => {
        callback(undefined, (err, allow) => {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          done();
        });
      });

      it('should allow any origin', (done) => {
        callback('https://any-origin.com', (err, allow) => {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          done();
        });
      });
    });

    describe('with specific origins', () => {
      const allowedOrigins: CorsOrigins = [
        'https://app.example.com',
        'https://admin.example.com',
      ];
      const callback = createCorsOriginCallback(allowedOrigins);

      it('should allow requests with no origin (mobile/curl)', (done) => {
        callback(undefined, (err, allow) => {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          done();
        });
      });

      it('should allow origin in the allowed list', (done) => {
        callback('https://app.example.com', (err, allow) => {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          done();
        });
      });

      it('should allow second origin in the allowed list', (done) => {
        callback('https://admin.example.com', (err, allow) => {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          done();
        });
      });

      it('should reject origin not in allowed list', (done) => {
        callback('https://malicious.com', (err, allow) => {
          expect(err).toBeInstanceOf(Error);
          expect(err?.message).toContain('not allowed by CORS');
          expect(err?.message).toContain('https://malicious.com');
          expect(allow).toBeUndefined();
          done();
        });
      });

      it('should reject similar but different origin', (done) => {
        callback('https://app.example.com.attacker.com', (err, allow) => {
          expect(err).toBeInstanceOf(Error);
          done();
        });
      });

      it('should reject origin with different protocol', (done) => {
        callback('http://app.example.com', (err, allow) => {
          expect(err).toBeInstanceOf(Error);
          done();
        });
      });

      it('should reject origin with port when not specified', (done) => {
        callback('https://app.example.com:8080', (err, allow) => {
          expect(err).toBeInstanceOf(Error);
          done();
        });
      });
    });

    describe('with empty origins array', () => {
      const callback = createCorsOriginCallback([]);

      it('should allow requests with no origin', (done) => {
        callback(undefined, (err, allow) => {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          done();
        });
      });

      it('should reject all origins', (done) => {
        callback('https://any.com', (err, allow) => {
          expect(err).toBeInstanceOf(Error);
          done();
        });
      });
    });
  });

  describe('corsOptions', () => {
    it('should include all required HTTP methods', () => {
      expect(corsOptions.methods).toContain('GET');
      expect(corsOptions.methods).toContain('POST');
      expect(corsOptions.methods).toContain('PUT');
      expect(corsOptions.methods).toContain('PATCH');
      expect(corsOptions.methods).toContain('DELETE');
      expect(corsOptions.methods).toContain('OPTIONS');
      expect(corsOptions.methods).toContain('HEAD');
    });

    it('should have credentials enabled', () => {
      expect(corsOptions.credentials).toBe(true);
    });

    it('should include required headers in allowedHeaders', () => {
      expect(corsOptions.allowedHeaders).toContain('Content-Type');
      expect(corsOptions.allowedHeaders).toContain('Authorization');
      expect(corsOptions.allowedHeaders).toContain('account-id');
      expect(corsOptions.allowedHeaders).toContain('X-Request-ID');
    });

    it('should expose X-Request-ID header', () => {
      expect(corsOptions.exposedHeaders).toContain('X-Request-ID');
    });

    it('should have maxAge of 24 hours (86400 seconds)', () => {
      expect(corsOptions.maxAge).toBe(86400);
    });
  });
});
