/**
 * Tenant isolation configuration types.
 *
 * This file defines the available tenant strategies and their configuration options.
 * See docs/multi-tenancy.md for detailed documentation.
 */

export enum TenantStrategy {
  /**
   * Tenant ID passed via HTTP header (default).
   * Header name: account-id
   */
  HEADER = 'header',

  /**
   * Tenant determined from subdomain.
   * Example: tenant1.app.com → tenant1
   */
  SUBDOMAIN = 'subdomain',

  /**
   * Tenant ID in URL path.
   * Example: /api/v1/tenants/:tenantId/resources
   */
  PATH = 'path',
}

export interface TenantConfig {
  /** The strategy used for tenant resolution */
  strategy: TenantStrategy;

  /** Header name for HEADER strategy (default: 'account-id') */
  headerName?: string;

  /** Application domain for SUBDOMAIN strategy */
  appDomain?: string;

  /** Subdomains to skip (e.g., 'www', 'api') */
  skipSubdomains?: string[];

  /** Whether to allow requests without tenant context */
  allowNoTenant?: boolean;
}

/**
 * Default tenant configuration
 */
export const defaultTenantConfig: TenantConfig = {
  strategy: TenantStrategy.HEADER,
  headerName: 'account-id',
  allowNoTenant: false,
};

/**
 * Get tenant configuration from environment
 */
export function getTenantConfig(): TenantConfig {
  const strategy =
    (process.env.TENANT_STRATEGY as TenantStrategy) || TenantStrategy.HEADER;

  return {
    strategy,
    headerName: process.env.TENANT_HEADER_NAME || 'account-id',
    appDomain: process.env.APP_DOMAIN,
    skipSubdomains: process.env.SKIP_SUBDOMAINS?.split(',').map((s) =>
      s.trim(),
    ) || ['www', 'api', 'localhost'],
    allowNoTenant: process.env.ALLOW_NO_TENANT === 'true',
  };
}
