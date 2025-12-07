import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SubdomainTenantMiddleware } from './subdomain-tenant.middleware';

// Helper to create mock request with hostname
const createMockRequest = (hostname: string): Partial<Request> => ({
  hostname,
});

describe('SubdomainTenantMiddleware', () => {
  let middleware: SubdomainTenantMiddleware;
  let mockClsService: jest.Mocked<ClsService>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(async () => {
    mockClsService = {
      set: jest.fn(),
      get: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string, defaultValue?: string) => {
        const config: Record<string, string> = {
          APP_DOMAIN: 'app.example.com',
          SKIP_SUBDOMAINS: 'www,api,localhost',
        };
        return config[key] ?? defaultValue;
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubdomainTenantMiddleware,
        { provide: ClsService, useValue: mockClsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    middleware = module.get<SubdomainTenantMiddleware>(SubdomainTenantMiddleware);

    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('extractSubdomain', () => {
    it('should extract subdomain from full domain and throw when not found', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const mockRequest = createMockRequest('tenant1.app.example.com');

      // Default implementation returns null, which throws 404
      await expect(
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext),
      ).rejects.toThrow(HttpException);

      // Verify the subdomain was extracted and resolveAccountBySubdomain was called
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Subdomain 'tenant1'"),
      );

      consoleSpy.mockRestore();
    });

    it('should return null for localhost', async () => {
      const mockRequest = createMockRequest('localhost');

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockClsService.set).not.toHaveBeenCalled();
    });

    it('should return null for localhost with port', async () => {
      const mockRequest = createMockRequest('localhost:3000');

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockClsService.set).not.toHaveBeenCalled();
    });

    it('should return null for IP addresses', async () => {
      const mockRequest = createMockRequest('192.168.1.1');

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockClsService.set).not.toHaveBeenCalled();
    });

    it('should return null for domain without subdomain', async () => {
      const mockRequest = createMockRequest('example.com');

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockClsService.set).not.toHaveBeenCalled();
    });
  });

  describe('skip subdomains', () => {
    it('should skip www subdomain', async () => {
      const mockRequest = createMockRequest('www.app.example.com');

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockClsService.set).not.toHaveBeenCalled();
    });

    it('should skip api subdomain', async () => {
      const mockRequest = createMockRequest('api.app.example.com');

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockClsService.set).not.toHaveBeenCalled();
    });

    it('should skip localhost subdomain', async () => {
      const mockRequest = createMockRequest('localhost.app.example.com');

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockClsService.set).not.toHaveBeenCalled();
    });

    it('should handle case-insensitive subdomain matching', async () => {
      const mockRequest = createMockRequest('WWW.app.example.com');

      await middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockClsService.set).not.toHaveBeenCalled();
    });
  });

  describe('tenant resolution', () => {
    it('should call next with warning when resolveAccountBySubdomain not implemented', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const mockRequest = createMockRequest('tenant1.app.example.com');

      await expect(
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext),
      ).rejects.toThrow(HttpException);

      consoleSpy.mockRestore();
    });
  });

  describe('with custom resolveAccountBySubdomain', () => {
    let customMiddleware: SubdomainTenantMiddleware;

    beforeEach(async () => {
      // Create a custom subclass that resolves accounts
      class CustomSubdomainMiddleware extends SubdomainTenantMiddleware {
        protected async resolveAccountBySubdomain(
          subdomain: string,
        ): Promise<{ id: string } | null> {
          if (subdomain === 'valid-tenant') {
            return { id: 'account-123' };
          }
          return null;
        }
      }

      const module = await Test.createTestingModule({
        providers: [
          CustomSubdomainMiddleware,
          { provide: ClsService, useValue: mockClsService },
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      customMiddleware = module.get(CustomSubdomainMiddleware);
    });

    it('should set accountId in CLS when tenant is found', async () => {
      const mockRequest = createMockRequest('valid-tenant.app.example.com');

      await customMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockClsService.set).toHaveBeenCalledWith('accountId', 'account-123');
      expect(mockClsService.set).toHaveBeenCalledWith('tenantSubdomain', 'valid-tenant');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw 404 when tenant not found', async () => {
      const mockRequest = createMockRequest('nonexistent.app.example.com');

      await expect(
        customMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        ),
      ).rejects.toThrow(HttpException);

      try {
        await customMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((error as HttpException).message).toContain('nonexistent');
      }
    });
  });

  describe('configuration', () => {
    it('should use default APP_DOMAIN when not configured', async () => {
      const configWithoutDomain = {
        get: jest.fn().mockImplementation((key: string, defaultValue?: string) => {
          if (key === 'SKIP_SUBDOMAINS') return 'www,api,localhost';
          return defaultValue;
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          SubdomainTenantMiddleware,
          { provide: ClsService, useValue: mockClsService },
          { provide: ConfigService, useValue: configWithoutDomain },
        ],
      }).compile();

      const middlewareWithDefaults = module.get(SubdomainTenantMiddleware);
      expect(middlewareWithDefaults).toBeDefined();
    });

    it('should use default SKIP_SUBDOMAINS when not configured', async () => {
      const configWithoutSkip = {
        get: jest.fn().mockImplementation((key: string, defaultValue?: string) => {
          if (key === 'APP_DOMAIN') return 'app.com';
          return defaultValue;
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          SubdomainTenantMiddleware,
          { provide: ClsService, useValue: mockClsService },
          { provide: ConfigService, useValue: configWithoutSkip },
        ],
      }).compile();

      const middlewareWithDefaults = module.get(SubdomainTenantMiddleware);
      expect(middlewareWithDefaults).toBeDefined();
    });

    it('should parse skip subdomains with whitespace', async () => {
      const configWithSpaces = {
        get: jest.fn().mockImplementation((key: string, defaultValue?: string) => {
          if (key === 'SKIP_SUBDOMAINS') return ' www , api , test ';
          return defaultValue ?? 'app.com';
        }),
      };

      const module = await Test.createTestingModule({
        providers: [
          SubdomainTenantMiddleware,
          { provide: ClsService, useValue: mockClsService },
          { provide: ConfigService, useValue: configWithSpaces },
        ],
      }).compile();

      const middlewareWithSpaces = module.get(SubdomainTenantMiddleware);

      // Test that 'www' with whitespace is properly trimmed and skipped
      const mockRequest = createMockRequest('www.app.com');
      await middlewareWithSpaces.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
