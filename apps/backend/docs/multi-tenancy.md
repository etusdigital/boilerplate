# Multi-Tenancy Architecture

This document describes the multi-tenancy implementation in the boilerplate and the available strategies for tenant isolation.

## Overview

The application supports multiple tenants (accounts) with data isolation. Each user can belong to multiple accounts with different roles in each.

## Current Implementation: Header-Based Tenancy

The default strategy uses an `account-id` HTTP header to identify the current tenant.

### How It Works

1. Client sends `account-id` header with each request
2. `AccountMiddleware` extracts and validates the header
3. Account ID is stored in CLS (Continuation Local Storage) context
4. Services access the account ID via `ClsService.get('accountId')`

### Request Flow

```
Client Request
    │
    ├── Header: Authorization: Bearer <jwt>
    ├── Header: account-id: <uuid>
    │
    ▼
AccountMiddleware
    │
    ├── Validate account-id header exists
    ├── Extract and decode JWT token
    ├── Look up user by provider ID
    ├── Store context in CLS:
    │   ├── accountId
    │   ├── user
    │   ├── transactionId
    │   ├── ip
    │   └── userAgent
    │
    ▼
Route Handler / Service
    │
    └── Access context via ClsService
```

### Configuration

The middleware is configured in `app.module.ts`:

```typescript
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, AccountMiddleware)
      .exclude('users/login')
      .forRoutes('*');
  }
}
```

### Usage in Services

```typescript
@Injectable()
export class MyService {
  constructor(private readonly cls: ClsService) {}

  async doSomething() {
    const accountId = this.cls.get('accountId');
    const user = this.cls.get('user');
    // Use accountId to filter data
  }
}
```

---

## Alternative Strategy: Subdomain-Based Tenancy

For applications that want to use subdomains (e.g., `tenant1.app.com`, `tenant2.app.com`).

### Implementation

Use `SubdomainTenantMiddleware` instead of or alongside `AccountMiddleware`:

```typescript
// src/middlewares/subdomain-tenant.middleware.ts
@Injectable()
export class SubdomainTenantMiddleware implements NestMiddleware {
  constructor(
    private readonly cls: ClsService,
    private readonly accountsService: AccountsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.hostname;
    const subdomain = host.split('.')[0];

    // Skip for www, api, or localhost
    if (['www', 'api', 'localhost'].includes(subdomain)) {
      return next();
    }

    const account = await this.accountsService.findBySubdomain(subdomain);
    if (!account) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }

    this.cls.set('accountId', account.id);
    next();
  }
}
```

### Database Changes Required

Add a `subdomain` column to the accounts table:

```typescript
@Entity('accounts')
export class Account {
  @Column({ unique: true, nullable: true })
  subdomain: string;
}
```

### DNS Configuration

Configure wildcard DNS: `*.app.com → your-server-ip`

---

## Alternative Strategy: Path-Based Tenancy

For APIs where the tenant is part of the URL path (e.g., `/api/v1/tenants/:tenantId/resources`).

### Implementation

```typescript
// Use route parameters instead of middleware
@Controller('tenants/:tenantId/users')
export class TenantUsersController {
  @Get()
  async getUsers(@Param('tenantId') tenantId: string) {
    // Validate user has access to this tenant
    // Query users for this tenant
  }
}
```

### Pros and Cons

| Aspect | Path-Based |
|--------|------------|
| ✅ Pros | Explicit, RESTful, easy to cache |
| ❌ Cons | Longer URLs, requires parameter in every route |

---

## Data Isolation Patterns

### 1. Application-Level Filtering (Current)

Data is filtered in service/repository layer:

```typescript
async findAll(): Promise<User[]> {
  const accountId = this.cls.get('accountId');
  return this.userRepository.find({
    where: { accountId }
  });
}
```

### 2. Row-Level Security (PostgreSQL Only)

PostgreSQL supports automatic row filtering:

```sql
-- Enable RLS on table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY tenant_isolation ON users
  USING (account_id = current_setting('app.current_tenant')::uuid);

-- Set tenant in session
SET app.current_tenant = 'account-uuid';
```

#### Implementation with TypeORM

```typescript
// Before each query
await queryRunner.query(
  `SET app.current_tenant = '${accountId}'`
);
```

### 3. Separate Schemas (PostgreSQL)

Each tenant gets a separate schema:

```typescript
async getConnection(tenantId: string): Promise<Connection> {
  return createConnection({
    ...baseConfig,
    schema: `tenant_${tenantId}`,
  });
}
```

### 4. Separate Databases

Most isolated but complex to manage:

```typescript
const connections = new Map<string, Connection>();

async getConnection(tenantId: string): Promise<Connection> {
  if (!connections.has(tenantId)) {
    const connection = await createConnection({
      ...baseConfig,
      database: `app_${tenantId}`,
    });
    connections.set(tenantId, connection);
  }
  return connections.get(tenantId);
}
```

---

## Strategy Comparison

| Strategy | Isolation Level | Complexity | Use Case |
|----------|----------------|------------|----------|
| Header-based | Application | Low | APIs, SPAs |
| Subdomain | Application | Medium | SaaS products |
| Path-based | Application | Low | RESTful APIs |
| Row-Level Security | Database | Medium | PostgreSQL apps |
| Separate Schemas | Database | High | Enterprise |
| Separate Databases | Infrastructure | Very High | Regulated industries |

---

## Configuration Options

### Environment Variables

```bash
# Tenant strategy (header, subdomain, path)
TENANT_STRATEGY=header

# For subdomain strategy
APP_DOMAIN=app.com
SKIP_SUBDOMAINS=www,api,localhost

# For RLS strategy
USE_ROW_LEVEL_SECURITY=true
```

### Tenant Configuration Type

```typescript
// src/config/tenant.config.ts
export enum TenantStrategy {
  HEADER = 'header',
  SUBDOMAIN = 'subdomain',
  PATH = 'path',
}

export interface TenantConfig {
  strategy: TenantStrategy;
  headerName?: string;  // For header strategy
  appDomain?: string;   // For subdomain strategy
  skipSubdomains?: string[];
}
```

---

## Security Considerations

1. **Always validate tenant access**: Check that the user has permission to access the requested tenant
2. **Audit cross-tenant access attempts**: Log when users try to access unauthorized tenants
3. **Use database-level isolation for sensitive data**: Consider RLS or separate schemas for regulated industries
4. **Validate tenant ID format**: Ensure tenant IDs are valid UUIDs to prevent injection
5. **Rate limit per tenant**: Prevent one tenant from consuming all resources

---

## Migration Between Strategies

### From Header to Subdomain

1. Add `subdomain` column to accounts table
2. Populate subdomains for existing accounts
3. Configure DNS wildcard
4. Add SubdomainTenantMiddleware
5. Update frontend to use subdomains
6. (Optional) Keep header support for backwards compatibility

### To Row-Level Security

1. Ensure PostgreSQL is used
2. Add RLS policies to all tenant-scoped tables
3. Modify connection handler to set tenant context
4. Test thoroughly - RLS errors fail silently
