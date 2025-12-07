import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { ConfigService } from '@nestjs/config';

/**
 * Subdomain-based tenant middleware.
 *
 * Extracts tenant from subdomain (e.g., tenant1.app.com → tenant1).
 * Use this as an alternative to header-based tenant resolution.
 *
 * Configuration:
 * - APP_DOMAIN: Your application domain (e.g., 'app.com')
 * - SKIP_SUBDOMAINS: Comma-separated subdomains to skip (e.g., 'www,api,localhost')
 *
 * Usage in app.module.ts:
 * ```typescript
 * consumer
 *   .apply(ClsMiddleware, SubdomainTenantMiddleware)
 *   .forRoutes('*');
 * ```
 *
 * To enable subdomain resolution, extend this class and override resolveAccountBySubdomain:
 * ```typescript
 * @Injectable()
 * export class MySubdomainMiddleware extends SubdomainTenantMiddleware {
 *   constructor(
 *     cls: ClsService,
 *     configService: ConfigService,
 *     private readonly accountsService: AccountsService,
 *   ) {
 *     super(cls, configService);
 *   }
 *
 *   protected async resolveAccountBySubdomain(subdomain: string) {
 *     return this.accountsService.findBySubdomain(subdomain);
 *   }
 * }
 * ```
 */
@Injectable()
export class SubdomainTenantMiddleware implements NestMiddleware {
  private readonly skipSubdomains: string[];
  private readonly appDomain: string;

  constructor(
    private readonly cls: ClsService,
    private readonly configService: ConfigService,
  ) {
    this.appDomain = this.configService.get<string>('APP_DOMAIN', 'localhost');
    this.skipSubdomains = this.configService
      .get<string>('SKIP_SUBDOMAINS', 'www,api,localhost')
      .split(',')
      .map((s) => s.trim().toLowerCase());
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.hostname.toLowerCase();

    // Extract subdomain
    const subdomain = this.extractSubdomain(host);

    // Skip if no subdomain or it's in the skip list
    if (!subdomain || this.skipSubdomains.includes(subdomain)) {
      return next();
    }

    // Look up account by subdomain
    const account = await this.resolveAccountBySubdomain(subdomain);
    if (!account) {
      throw new HttpException(
        `Tenant '${subdomain}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Store account ID in CLS context
    this.cls.set('accountId', account.id);
    this.cls.set('tenantSubdomain', subdomain);

    next();
  }

  private extractSubdomain(host: string): string | null {
    // Handle localhost with port
    if (host.startsWith('localhost')) {
      return null;
    }

    // Handle IP addresses
    if (/^\d+\.\d+\.\d+\.\d+/.test(host)) {
      return null;
    }

    const parts = host.split('.');

    // Need at least 3 parts for subdomain.domain.tld
    if (parts.length < 3) {
      return null;
    }

    return parts[0];
  }

  /**
   * Resolve account by subdomain.
   *
   * Override this method or implement findBySubdomain in AccountsService
   * to enable subdomain-based tenant resolution.
   *
   * Required changes:
   * 1. Add 'subdomain' column to Account entity
   * 2. Add findBySubdomain method to AccountsService
   * 3. Or override this method in a subclass
   */
  protected async resolveAccountBySubdomain(
    subdomain: string,
  ): Promise<{ id: string } | null> {
    // TODO: Implement one of these approaches:
    //
    // Option 1: Add to AccountsService
    // return await this.accountsService.findBySubdomain(subdomain);
    //
    // Option 2: Query directly
    // return await this.accountRepository.findOne({ where: { subdomain } });
    //
    // Option 3: Use subdomain as account ID (if subdomains are UUIDs)
    // return { id: subdomain };

    console.warn(
      `SubdomainTenantMiddleware: findBySubdomain not implemented. ` +
        `Subdomain '${subdomain}' cannot be resolved.`,
    );
    return null;
  }
}
