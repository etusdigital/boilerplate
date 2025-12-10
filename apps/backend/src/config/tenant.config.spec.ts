import {
  TenantStrategy,
  TenantConfig,
  defaultTenantConfig,
  getTenantConfig,
} from './tenant.config';

describe('Tenant Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment for each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('TenantStrategy', () => {
    it('should have HEADER strategy', () => {
      expect(TenantStrategy.HEADER).toBe('header');
    });

    it('should have SUBDOMAIN strategy', () => {
      expect(TenantStrategy.SUBDOMAIN).toBe('subdomain');
    });

    it('should have PATH strategy', () => {
      expect(TenantStrategy.PATH).toBe('path');
    });

    it('should have exactly 3 strategies', () => {
      const strategies = Object.values(TenantStrategy);
      expect(strategies).toHaveLength(3);
    });
  });

  describe('defaultTenantConfig', () => {
    it('should use HEADER strategy by default', () => {
      expect(defaultTenantConfig.strategy).toBe(TenantStrategy.HEADER);
    });

    it('should use account-id as default header name', () => {
      expect(defaultTenantConfig.headerName).toBe('account-id');
    });

    it('should not allow requests without tenant by default', () => {
      expect(defaultTenantConfig.allowNoTenant).toBe(false);
    });
  });

  describe('getTenantConfig', () => {
    it('should return default HEADER strategy when not configured', () => {
      delete process.env.TENANT_STRATEGY;

      const config = getTenantConfig();

      expect(config.strategy).toBe(TenantStrategy.HEADER);
    });

    it('should use TENANT_STRATEGY from environment', () => {
      process.env.TENANT_STRATEGY = 'subdomain';

      const config = getTenantConfig();

      expect(config.strategy).toBe('subdomain');
    });

    it('should use PATH strategy from environment', () => {
      process.env.TENANT_STRATEGY = 'path';

      const config = getTenantConfig();

      expect(config.strategy).toBe('path');
    });

    it('should use default header name when not configured', () => {
      delete process.env.TENANT_HEADER_NAME;

      const config = getTenantConfig();

      expect(config.headerName).toBe('account-id');
    });

    it('should use custom header name from environment', () => {
      process.env.TENANT_HEADER_NAME = 'x-tenant-id';

      const config = getTenantConfig();

      expect(config.headerName).toBe('x-tenant-id');
    });

    it('should use APP_DOMAIN from environment', () => {
      process.env.APP_DOMAIN = 'myapp.example.com';

      const config = getTenantConfig();

      expect(config.appDomain).toBe('myapp.example.com');
    });

    it('should have undefined appDomain when not configured', () => {
      delete process.env.APP_DOMAIN;

      const config = getTenantConfig();

      expect(config.appDomain).toBeUndefined();
    });

    it('should use default skip subdomains when not configured', () => {
      delete process.env.SKIP_SUBDOMAINS;

      const config = getTenantConfig();

      expect(config.skipSubdomains).toEqual(['www', 'api', 'localhost']);
    });

    it('should parse SKIP_SUBDOMAINS from environment', () => {
      process.env.SKIP_SUBDOMAINS = 'www,api,static,cdn';

      const config = getTenantConfig();

      expect(config.skipSubdomains).toEqual(['www', 'api', 'static', 'cdn']);
    });

    it('should trim whitespace from skip subdomains', () => {
      process.env.SKIP_SUBDOMAINS = ' www , api , static ';

      const config = getTenantConfig();

      expect(config.skipSubdomains).toEqual(['www', 'api', 'static']);
    });

    it('should not allow requests without tenant by default', () => {
      delete process.env.ALLOW_NO_TENANT;

      const config = getTenantConfig();

      expect(config.allowNoTenant).toBe(false);
    });

    it('should allow no tenant when ALLOW_NO_TENANT is true', () => {
      process.env.ALLOW_NO_TENANT = 'true';

      const config = getTenantConfig();

      expect(config.allowNoTenant).toBe(true);
    });

    it('should not allow no tenant when ALLOW_NO_TENANT is false', () => {
      process.env.ALLOW_NO_TENANT = 'false';

      const config = getTenantConfig();

      expect(config.allowNoTenant).toBe(false);
    });

    it('should not allow no tenant for invalid ALLOW_NO_TENANT value', () => {
      process.env.ALLOW_NO_TENANT = 'yes';

      const config = getTenantConfig();

      expect(config.allowNoTenant).toBe(false);
    });

    it('should return complete TenantConfig object', () => {
      process.env.TENANT_STRATEGY = 'subdomain';
      process.env.TENANT_HEADER_NAME = 'x-tenant';
      process.env.APP_DOMAIN = 'myapp.com';
      process.env.SKIP_SUBDOMAINS = 'www,api';
      process.env.ALLOW_NO_TENANT = 'true';

      const config = getTenantConfig();

      expect(config).toEqual({
        strategy: 'subdomain',
        headerName: 'x-tenant',
        appDomain: 'myapp.com',
        skipSubdomains: ['www', 'api'],
        allowNoTenant: true,
      });
    });
  });

  describe('TenantConfig interface', () => {
    it('should allow creating minimal config', () => {
      const config: TenantConfig = {
        strategy: TenantStrategy.HEADER,
      };

      expect(config.strategy).toBe(TenantStrategy.HEADER);
    });

    it('should allow creating full config', () => {
      const config: TenantConfig = {
        strategy: TenantStrategy.SUBDOMAIN,
        headerName: 'x-tenant-id',
        appDomain: 'example.com',
        skipSubdomains: ['www', 'api'],
        allowNoTenant: true,
      };

      expect(config.strategy).toBe(TenantStrategy.SUBDOMAIN);
      expect(config.headerName).toBe('x-tenant-id');
      expect(config.appDomain).toBe('example.com');
      expect(config.skipSubdomains).toEqual(['www', 'api']);
      expect(config.allowNoTenant).toBe(true);
    });
  });
});
