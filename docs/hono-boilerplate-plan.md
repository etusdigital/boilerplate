# Hono Boilerplate Plan

This document outlines a plan to create a new backend boilerplate using Hono.js, preserving the core concepts from the NestJS boilerplate while leveraging Hono's lightweight, type-safe approach.

## Key Hono Features to Leverage

| Feature | Benefit |
|---------|---------|
| `@hono/zod-openapi` | Schema validation + auto-generated OpenAPI docs in one |
| `OpenAPIHono` | Extended Hono class with built-in OpenAPI support |
| `createRoute()` | Type-safe route definitions with request/response schemas |
| RPC mode | End-to-end type safety if frontend consumes the API |
| `createFactory()` | Centralized type definitions, reduces boilerplate |
| `c.set()`/`c.get()` | Built-in request-scoped context (replaces nestjs-cls) |
| JWT helper | Native JWT verify/sign/decode with multiple algorithms |

## Project Structure

```
src/
├── index.ts                 # Entry point with serve()
├── app.ts                   # OpenAPIHono app factory
├── env.ts                   # Zod schema for env validation
│
├── middleware/
│   ├── auth.ts              # JWT validation middleware
│   ├── account.ts           # account-id header + membership check
│   ├── request-context.ts   # Sets user, requestId, ip in context
│   └── error-handler.ts     # defaultHook for validation errors
│
├── routes/
│   ├── index.ts             # app.route() aggregation + OpenAPI doc
│   ├── users/
│   │   ├── index.ts         # OpenAPIHono sub-app
│   │   ├── routes.ts        # createRoute() definitions
│   │   ├── handlers.ts      # Handler implementations
│   │   └── schemas.ts       # Zod schemas with .openapi()
│   └── accounts/
│       └── ...
│
├── db/
│   ├── client.ts            # Drizzle client
│   ├── schema/
│   │   ├── users.ts
│   │   ├── accounts.ts
│   │   ├── user-accounts.ts
│   │   └── audit-logs.ts
│   ├── migrations/
│   └── seed.ts
│
├── services/
│   ├── users.ts             # Business logic
│   ├── accounts.ts
│   ├── audit.ts
│   └── identity-provider.ts # Auth0 abstraction
│
├── auth/
│   ├── permissions.ts       # Permission enum + matrix
│   ├── roles.ts             # Role enum + helpers
│   └── guards.ts            # requireRole(), requirePermission()
│
├── lib/
│   ├── pagination.ts        # Pagination helpers
│   ├── errors.ts            # Custom error classes
│   └── result.ts            # Result<T, E> type (optional)
│
└── types/
    └── index.ts             # Shared types, Env definition
```

## Core Dependencies

```json
{
  "dependencies": {
    "hono": "^4.x",
    "@hono/node-server": "^1.x",
    "@hono/zod-openapi": "^0.x",
    "@hono/swagger-ui": "^0.x",
    "drizzle-orm": "^0.x",
    "better-sqlite3": "^11.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "drizzle-kit": "^0.x",
    "typescript": "^5.x",
    "@types/node": "^22.x",
    "@types/better-sqlite3": "^7.x"
  }
}
```

## Implementation Details

### 1. App Factory with Typed Environment

```typescript
// app.ts
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

export type Env = {
  Variables: {
    requestId: string
    user: User | null
    accountId: string
    userRole: Role | null
  }
}

export const createApp = () => {
  const app = new OpenAPIHono<Env>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json({
          error: 'Validation Error',
          details: result.error.flatten()
        }, 400)
      }
    }
  })

  return app
}
```

### 2. Route Definitions with `createRoute()`

```typescript
// routes/users/routes.ts
import { createRoute, z } from '@hono/zod-openapi'
import { UserSchema, CreateUserSchema } from './schemas'

export const listUsers = createRoute({
  method: 'get',
  path: '/users',
  tags: ['Users'],
  security: [{ Bearer: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(50),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: PaginatedUsersSchema } },
      description: 'List of users',
    },
    401: { description: 'Unauthorized' },
  },
})

export const createUser = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  middleware: [requireRole('ADMIN')],  // Inline guard
  request: {
    body: { content: { 'application/json': { schema: CreateUserSchema } } },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: UserSchema } },
      description: 'User created',
    },
  },
})
```

### 3. Schemas with OpenAPI Metadata

```typescript
// routes/users/schemas.ts
import { z } from '@hono/zod-openapi'

export const UserSchema = z.object({
  id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
  email: z.string().email().openapi({ example: 'user@example.com' }),
  name: z.string().openapi({ example: 'John Doe' }),
  status: z.enum(['active', 'inactive']).openapi({ example: 'active' }),
  isSuperAdmin: z.boolean().openapi({ example: false }),
  createdAt: z.string().datetime(),
}).openapi('User')

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  accountIds: z.array(z.string().uuid()).optional(),
}).openapi('CreateUserInput')
```

### 4. Handlers with Typed Context

```typescript
// routes/users/handlers.ts
import type { Context } from 'hono'
import type { Env } from '../../app'

export const handleListUsers = async (c: Context<Env>) => {
  const { page, limit } = c.req.valid('query')  // Typed from route schema
  const user = c.get('user')                    // From middleware
  const accountId = c.get('accountId')

  const result = await usersService.findAll({ page, limit, accountId })
  return c.json(result, 200)
}

export const handleCreateUser = async (c: Context<Env>) => {
  const body = c.req.valid('json')  // Typed as CreateUserSchema
  const actor = c.get('user')

  const user = await usersService.create(body, actor)
  return c.json(user, 201)
}
```

### 5. Route Module Assembly

```typescript
// routes/users/index.ts
import { OpenAPIHono } from '@hono/zod-openapi'
import { listUsers, createUser } from './routes'
import { handleListUsers, handleCreateUser } from './handlers'
import type { Env } from '../../app'

const users = new OpenAPIHono<Env>()

users.openapi(listUsers, handleListUsers)
users.openapi(createUser, handleCreateUser)

export { users }
```

### 6. Main App with Swagger UI

```typescript
// routes/index.ts
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { users } from './users'
import { accounts } from './accounts'
import type { Env } from '../app'

const api = new OpenAPIHono<Env>()

api.route('/users', users)
api.route('/accounts', accounts)

// OpenAPI JSON endpoint
api.doc('/doc', {
  openapi: '3.1.0',
  info: { title: 'Etus API', version: '1.0.0' },
  security: [{ Bearer: [] }],
})

// Swagger UI
api.get('/docs', swaggerUI({ url: '/doc' }))

export { api }
```

### 7. Drizzle Schema (Preserving Entity Model)

```typescript
// db/schema/users.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  status: text('status', { enum: ['active', 'inactive'] }).default('active'),
  providerIds: text('provider_ids', { mode: 'json' }).$type<string[]>().default([]),
  isSuperAdmin: integer('is_super_admin', { mode: 'boolean' }).default(false),

  // Soft delete + audit fields
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
  createdById: text('created_by_id').references(() => users.id),
  updatedById: text('updated_by_id').references(() => users.id),
  deletedById: text('deleted_by_id').references(() => users.id),
})
```

```typescript
// db/schema/accounts.ts
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  domain: text('domain').unique(),

  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
})
```

```typescript
// db/schema/user-accounts.ts
import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { accounts } from './accounts'

export const userAccounts = sqliteTable('user_accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  role: text('role', {
    enum: ['ADMIN', 'MANAGER', 'EDITOR', 'AUTHOR', 'VIEWER', 'BILLING', 'ANALYTICS']
  }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.accountId] }),
}))
```

```typescript
// db/schema/audit-logs.ts
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { users } from './users'
import { accounts } from './accounts'

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  transactionId: text('transaction_id').notNull(),
  accountId: text('account_id').references(() => accounts.id),
  userId: text('user_id').references(() => users.id),
  entity: text('entity').notNull(),
  entityId: text('entity_id').notNull(),
  action: text('action', { enum: ['INSERT', 'UPDATE', 'DELETE'] }).notNull(),
  changes: text('changes', { mode: 'json' }).$type<Record<string, unknown>>(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
})
```

### 8. Role Guard Middleware

```typescript
// auth/guards.ts
import { createMiddleware } from 'hono/factory'
import type { Env } from '../app'
import { hasMinimumRole, Role } from './roles'

export const requireRole = (minRole: Role) => {
  return createMiddleware<Env>(async (c, next) => {
    const user = c.get('user')
    const userRole = c.get('userRole')

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Super-admin bypass
    if (user.isSuperAdmin) {
      return next()
    }

    if (!userRole || !hasMinimumRole(userRole, minRole)) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    return next()
  })
}

export const requirePermission = (permission: Permission) => {
  return createMiddleware<Env>(async (c, next) => {
    const user = c.get('user')
    const userRole = c.get('userRole')

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    if (user.isSuperAdmin) {
      return next()
    }

    if (!userRole || !hasPermission(userRole, permission)) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    return next()
  })
}
```

### 9. Roles and Permissions

```typescript
// auth/roles.ts
export const Role = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EDITOR: 'EDITOR',
  AUTHOR: 'AUTHOR',
  VIEWER: 'VIEWER',
  BILLING: 'BILLING',
  ANALYTICS: 'ANALYTICS',
} as const

export type Role = typeof Role[keyof typeof Role]

const ROLE_HIERARCHY: Record<string, number> = {
  ADMIN: 0,
  MANAGER: 1,
  EDITOR: 2,
  AUTHOR: 3,
  VIEWER: 4,
  BILLING: -1,    // Non-hierarchical
  ANALYTICS: -1,  // Non-hierarchical
}

export const hasMinimumRole = (userRole: Role, requiredRole: Role): boolean => {
  const userLevel = ROLE_HIERARCHY[userRole]
  const requiredLevel = ROLE_HIERARCHY[requiredRole]

  // Non-hierarchical roles can only match exactly
  if (userLevel === -1 || requiredLevel === -1) {
    return userRole === requiredRole
  }

  return userLevel <= requiredLevel
}
```

```typescript
// auth/permissions.ts
export const Permission = {
  MANAGE_SYSTEM_SETTINGS: 'MANAGE_SYSTEM_SETTINGS',
  MANAGE_ALL_USERS: 'MANAGE_ALL_USERS',
  MANAGE_TEAM_USERS: 'MANAGE_TEAM_USERS',
  VIEW_ALL_USERS: 'VIEW_ALL_USERS',
  CREATE_CONTENT: 'CREATE_CONTENT',
  EDIT_ALL_CONTENT: 'EDIT_ALL_CONTENT',
  EDIT_OWN_CONTENT: 'EDIT_OWN_CONTENT',
  DELETE_CONTENT: 'DELETE_CONTENT',
  PUBLISH_CONTENT: 'PUBLISH_CONTENT',
  VIEW_CONTENT: 'VIEW_CONTENT',
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  MANAGE_BILLING: 'MANAGE_BILLING',
  VIEW_BILLING: 'VIEW_BILLING',
} as const

export type Permission = typeof Permission[keyof typeof Permission]

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    Permission.MANAGE_SYSTEM_SETTINGS,
    Permission.MANAGE_ALL_USERS,
    Permission.CREATE_CONTENT,
    Permission.EDIT_ALL_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.VIEW_CONTENT,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_BILLING,
    Permission.VIEW_BILLING,
  ],
  MANAGER: [
    Permission.MANAGE_TEAM_USERS,
    Permission.VIEW_ALL_USERS,
    Permission.CREATE_CONTENT,
    Permission.EDIT_ALL_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.VIEW_CONTENT,
    Permission.VIEW_ANALYTICS,
  ],
  EDITOR: [
    Permission.CREATE_CONTENT,
    Permission.EDIT_ALL_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.VIEW_CONTENT,
  ],
  AUTHOR: [
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.VIEW_CONTENT,
  ],
  VIEWER: [
    Permission.VIEW_CONTENT,
  ],
  BILLING: [
    Permission.MANAGE_BILLING,
    Permission.VIEW_BILLING,
  ],
  ANALYTICS: [
    Permission.VIEW_ANALYTICS,
  ],
}

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
```

### 10. JWT Auth Middleware

```typescript
// middleware/auth.ts
import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import type { Env } from '../app'

export const jwtAuth = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401)
  }

  const token = authHeader.slice(7)

  try {
    // For Auth0 with RS256, you'd use JWKS validation
    // This is simplified for HS256
    const payload = await verify(token, process.env.JWT_SECRET!)

    c.set('user', {
      id: payload.sub as string,
      email: payload.email as string,
      isSuperAdmin: payload.isSuperAdmin as boolean ?? false,
    })

    return next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})
```

### 11. Account Middleware

```typescript
// middleware/account.ts
import { createMiddleware } from 'hono/factory'
import type { Env } from '../app'
import { db } from '../db/client'
import { userAccounts } from '../db/schema'
import { eq, and } from 'drizzle-orm'

export const accountMiddleware = createMiddleware<Env>(async (c, next) => {
  const accountId = c.req.header('account-id')
  const user = c.get('user')

  if (!accountId) {
    return c.json({ error: 'account-id header required' }, 400)
  }

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Super-admin can access any account
  if (user.isSuperAdmin) {
    c.set('accountId', accountId)
    c.set('userRole', 'ADMIN')  // Treat as admin for super-admin
    return next()
  }

  // Check user belongs to account
  const [membership] = await db
    .select()
    .from(userAccounts)
    .where(and(
      eq(userAccounts.userId, user.id),
      eq(userAccounts.accountId, accountId)
    ))
    .limit(1)

  if (!membership) {
    return c.json({ error: 'Forbidden: No access to this account' }, 403)
  }

  c.set('accountId', accountId)
  c.set('userRole', membership.role)

  return next()
})
```

### 12. Entry Point

```typescript
// index.ts
import { serve } from '@hono/node-server'
import { createApp } from './app'
import { api } from './routes'
import { jwtAuth } from './middleware/auth'
import { accountMiddleware } from './middleware/account'
import { requestContext } from './middleware/request-context'

const app = createApp()

// Global middleware
app.use('*', requestContext)

// Protected routes
app.use('/users/*', jwtAuth, accountMiddleware)
app.use('/accounts/*', jwtAuth, accountMiddleware)

// Mount API routes
app.route('/', api)

// Health check (unprotected)
app.get('/health', (c) => c.json({ status: 'ok' }))

const port = parseInt(process.env.PORT ?? '3000')

console.log(`Server running on http://localhost:${port}`)
console.log(`API docs available at http://localhost:${port}/docs`)

serve({ fetch: app.fetch, port })
```

## What's Preserved from NestJS Boilerplate

| Concept | Status | Notes |
|---------|--------|-------|
| Entity model (User, Account, UserAccount, AuditLog) | Preserved | Same fields and relationships |
| Multi-tenant via `account-id` header | Preserved | Same pattern |
| Role hierarchy + permissions | Preserved | Same logic, lighter implementation |
| Super-admin bypass | Preserved | Same behavior |
| Soft deletes | Preserved | Drizzle columns instead of TypeORM |
| Request context | Preserved | `c.set()`/`c.get()` instead of CLS |
| JWT auth flow | Preserved | Hono's native JWT helper |
| OpenAPI docs | Preserved | `@hono/zod-openapi` + Swagger UI |
| Validation | Preserved | Zod instead of class-validator |
| Pagination contract | Preserved | Same query params and response shape |

## What's Different

| Aspect | NestJS | Hono |
|--------|--------|------|
| Framework weight | Heavy (~50+ deps) | Lightweight (zero deps core) |
| Route definition | Decorators | `createRoute()` function |
| Dependency injection | Built-in DI container | Direct imports / factory functions |
| Validation | class-validator | Zod schemas |
| ORM | TypeORM | Drizzle ORM |
| Context passing | CLS (implicit) | `c.set()`/`c.get()` (explicit) |
| Modules | NestJS modules | File-based organization |
| Guards | Guard classes | Middleware functions |
| OpenAPI | @nestjs/swagger decorators | `@hono/zod-openapi` schemas |

---

# Part 2: Architecture Reference Guide

This section documents all system design patterns, architectural decisions, and implementation details from the original NestJS boilerplate. Use this as a reference when implementing features in Hono.

---

## 1. Authentication & Authorization Flow

### 1.1 JWT Validation Flow with Auth0

The JWT validation uses a two-stage process:
- **JWKS Validation**: Uses `jwks-rsa` library with JWKS URI to retrieve and validate public keys
- **Token Structure**: Auth0 tokens contain custom claims in the namespace format

**Environment Variables Required:**
```bash
JWKS_URI=https://domain.region.auth0.com/.well-known/jwks.json
IDP_ISSUER=https://domain.region.auth0.com/
IDP_AUDIENCE=boilerplate-api
AUTH0_ROLES_NAME=https://your-namespace/roles  # Custom claim namespace
```

**JWT Payload Structure:**
```typescript
interface Auth0JWT {
  'https://your-namespace/roles': string[];  // Custom roles claim
  iss: string;                                // Issuer
  sub: string;                                // Subject (userId)
  aud: string[];                              // Audience
  iat: number;                                // Issued at
  exp: number;                                // Expiration
  scope: string;                              // OAuth scopes
  azp: string;                                // Authorized party
  permissions: string[];                      // Permissions array
  identities: string[];                       // Identity providers
  email: string;                              // Email claim
}
```

**Extracted User Object:**
```typescript
interface Auth0User {
  userId: string;      // from payload.sub
  roles: string[];     // from custom claim namespace
  permissions: string[];
  email: string;
  identities: string[];
}
```

### 1.2 Guard Execution Order

Guards/middleware are registered and executed in this order:

```
1. JwtAuthGuard    → Validates JWT token signature and expiration
2. RolesGuard      → Performs account-based role hierarchy checking
```

**JwtAuthGuard Behavior:**
- Extracts Bearer token from Authorization header
- Validates signature against JWKS
- Has route exceptions for public endpoints (login, health checks)
- These routes bypass JWT validation entirely

### 1.3 Middleware Flow in Hono

```typescript
// Equivalent flow in Hono
app.use('*', requestContext)           // 1. Initialize request context
app.use('/api/*', jwtAuth)             // 2. Validate JWT
app.use('/api/*', accountMiddleware)   // 3. Resolve account + role
// Route handlers execute here
```

---

## 2. Multi-Tenancy Implementation

### 2.1 Account Isolation Strategy

**Core Concept:** Every request requires an `account-id` header that identifies the tenant context.

**Validation Steps:**
1. **Tenant Identification**: Extract UUID from `account-id` header
2. **Token Validation**: Decode JWT to get user ID
3. **Membership Check**: Verify user belongs to the account
4. **Context Population**: Store tenant data in request context

```typescript
// Header requirement
const accountId = req.header('account-id');  // UUID format
if (!accountId) throw new Error('Account not exists');
```

### 2.2 Context Data Dictionary

| Key | Type | Source | Used For |
|-----|------|--------|----------|
| `accountId` | UUID | Request header | Tenant filtering, audit logging |
| `user` | User object | Database lookup via JWT sub | Authorization, audit logging |
| `transactionId` | UUID-v7 | Generated per request | Request correlation, audit trail |
| `ip` | string | `request.ip` | Audit logging, security |
| `userAgent` | string | Request header | Audit logging, analytics |
| `role` | Role enum | From user-account lookup | Authorization decisions |
| `isSystemAdminAccess` | boolean | Set when super-admin | Audit flag for super-admin operations |

### 2.3 User-Account Relationship Model

```
Users can belong to multiple accounts (many-to-many)
Each user-account pair has a specific role assigned

User ─────┬───── UserAccount ─────┬───── Account
          │                       │
          │  userId               │  accountId
          │  accountId            │  name
          │  role                 │  domain
          │                       │
          └───────────────────────┘
```

**Key Design Points:**
- Users can have different roles in different accounts
- `providerIds` array supports multiple identity providers per user
- `isSuperAdmin` flag is independent of account membership

### 2.4 Data Access Patterns Per Tenant

```typescript
// Pattern: Filter by user's accessible accounts
async findWithPagination(paginationQuery: PaginationQueryDto) {
  const user = getContextUser();

  if (user?.isSuperAdmin) {
    // Super admins see all records across all accounts
    return this.findAll();
  }

  // Regular users see only records from their accounts
  const accountIds = user.userAccounts.map(ua => ua.accountId);
  return this.findByAccountIds(accountIds);
}
```

---

## 3. Role-Based Access Control (RBAC)

### 3.1 Role Hierarchy

The hierarchy uses numeric values where **lower numbers indicate higher privileges**:

```typescript
const ROLE_HIERARCHY = {
  ADMIN: 0,        // Highest account role
  MANAGER: 1,
  EDITOR: 2,
  AUTHOR: 3,
  VIEWER: 4,       // Lowest hierarchical role
  BILLING: -1,     // Special non-hierarchical role
  ANALYTICS: -1,   // Special non-hierarchical role
};
```

**Key Design Decisions:**
- **Hierarchical roles** (ADMIN→VIEWER) follow strict hierarchy
- **Special roles** (BILLING, ANALYTICS) are non-hierarchical
- A MANAGER can access any EDITOR/AUTHOR/VIEWER endpoint
- BILLING users can ONLY access billing endpoints (no hierarchy)

### 3.2 Role Checking Logic

```typescript
function hasMinimumRole(
  userRole: Role,
  minimumRole: Role,
  additionalRoles: Role[] = []
): boolean {
  // Check non-hierarchical additional roles first
  if (additionalRoles.includes(userRole)) return true;

  const userLevel = ROLE_HIERARCHY[userRole];
  const minimumLevel = ROLE_HIERARCHY[minimumRole];

  // Special roles (-1) can't access hierarchical endpoints
  if (userLevel === -1) return false;
  if (minimumLevel === -1) return false;

  // Lower number = higher privilege
  return userLevel <= minimumLevel;
}
```

### 3.3 Permission Matrix Structure

Permissions are grouped by role:

```typescript
const ROLE_PERMISSIONS = {
  ADMIN: [
    'MANAGE_TENANT_SETTINGS',
    'MANAGE_ALL_USERS',
    'CREATE_CONTENT',
    'EDIT_ANY_CONTENT',
    'DELETE_CONTENT',
    'PUBLISH_CONTENT',
    'VIEW_ALL_CONTENT',
    'VIEW_ANALYTICS',
    'MANAGE_BILLING',
    'VIEW_BILLING',
  ],

  MANAGER: [
    'MANAGE_TEAM_USERS',
    'VIEW_ALL_USERS',
    'CREATE_CONTENT',
    'EDIT_ANY_CONTENT',
    'PUBLISH_CONTENT',
    'VIEW_CONTENT',
    'VIEW_ANALYTICS',
  ],

  BILLING: [
    'MANAGE_BILLING',
    'VIEW_BILLING',
  ],

  VIEWER: [
    'VIEW_PUBLISHED_CONTENT',
  ],
};
```

### 3.4 Super-Admin Bypass

Super admins are identified by a boolean flag on the User entity:

```typescript
// In role checking:
if (user.isSuperAdmin) {
  context.set('role', 'SYSTEM_ADMIN');
  context.set('isSystemAdminAccess', true);
  return true;  // Bypass all checks
}
```

**Use Cases for Super Admin:**
- System maintenance and debugging
- Emergency access when role assignments are broken
- Cross-account operations during migrations
- Platform-level administrative tasks

**Key Design Notes:**
- Independent of account membership
- Does NOT require entries in user_accounts table
- Provides access to all accounts without role-based filtering
- Logged separately for audit purposes

---

## 4. Entity Design Patterns

### 4.1 Base Entity Inheritance Hierarchy

Two-level inheritance structure:

```typescript
// Level 1: Basic audit timestamps with soft delete
abstract class SoftDeleteEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;  // NULL when not deleted
}

// Level 2: Adds user tracking for create/update/delete
abstract class InteractiveEntity extends SoftDeleteEntity {
  createdBy: User;
  updatedBy: User;
  deletedBy: User;
}
```

**Usage Pattern:**
```typescript
// For entities requiring soft delete only
class Account extends SoftDeleteEntity { }

// For entities requiring full audit trail
class User extends InteractiveEntity { }
```

### 4.2 Soft Delete Implementation

**Benefits:**
- Data recovery capability
- Historical data preservation
- Audit trail integrity
- No permanent data loss

**Query Behavior:**
- Queries automatically exclude soft-deleted rows by default
- Use `withDeleted: true` to include soft-deleted rows

### 4.3 Audit Log Entity

```typescript
interface AuditLog {
  id: string;
  transactionId: string;  // UUID-v7 from request context
  accountId: string;      // Tenant context
  userId: string;         // Who made the change
  entity: string;         // Entity name (e.g., 'User', 'Account')
  entityId: string;       // ID of changed entity
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  changes: object;        // JSON diff of changes
  ipAddress: string;      // From request context
  userAgent: string;      // From request context
  timestamp: Date;
}
```

---

## 5. Request Context Flow

### 5.1 Context Flow Through Application

```
Request arrives
    ↓
RequestContext Middleware
    ├─ Generate transactionId (UUID-v7)
    ├─ Extract IP address
    └─ Extract User-Agent
    ↓
JWT Auth Middleware
    └─ Validate JWT, extract user claims
    ↓
Account Middleware
    ├─ Extract account-id from header
    ├─ Fetch User from database
    ├─ Verify user belongs to account
    └─ Set user role for account
    ↓
Role Guard (per-route)
    ├─ Check minimum role requirement
    └─ Decide if access allowed
    ↓
Route Handler
    └─ Access all context data
    ↓
Service Layer
    └─ Uses context for multi-tenant filtering
    ↓
Audit Logger (on entity changes)
    ├─ Reads context
    └─ Creates AuditLog entry
    ↓
Response sent
```

### 5.2 Hono Context Implementation

```typescript
// Types for Hono context
type Env = {
  Variables: {
    requestId: string;
    transactionId: string;
    ip: string;
    userAgent: string;
    user: User | null;
    accountId: string;
    userRole: Role | null;
    isSystemAdminAccess: boolean;
  };
};

// Access in handlers
const user = c.get('user');
const accountId = c.get('accountId');
const transactionId = c.get('transactionId');
```

---

## 6. Error Handling

### 6.1 Error Response Structure

**Standard HTTP Exception:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**Validation Error (array of issues):**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "name should not be empty"
  ],
  "error": "Bad Request"
}
```

**Zod Validation Error (Hono):**
```json
{
  "error": "Validation Error",
  "details": {
    "fieldErrors": {
      "email": ["Invalid email"]
    },
    "formErrors": []
  }
}
```

### 6.2 HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 7. API Design Patterns

### 7.1 Pagination

**Query Parameters:**
```typescript
interface PaginationQuery {
  page?: number;      // Default: 1
  limit?: number;     // Default: 50, Max: 100
  sortBy?: string;    // Field to sort by
  sortOrder?: 'ASC' | 'DESC';  // Default: DESC
}
```

**Response Format:**
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
```

**Example Response:**
```json
{
  "data": [
    { "id": "...", "name": "..." }
  ],
  "meta": {
    "currentPage": 1,
    "limit": 50,
    "totalItems": 100,
    "totalPages": 2,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

### 7.2 Required Headers

```
Authorization: Bearer <JWT>
account-id: <UUID>
Content-Type: application/json
```

### 7.3 Endpoint Conventions

| Action | Method | Path | Response |
|--------|--------|------|----------|
| List | GET | `/resources` | Paginated array |
| Get One | GET | `/resources/:id` | Single object |
| Create | POST | `/resources` | Created object (201) |
| Update | PUT | `/resources/:id` | Updated object |
| Delete | DELETE | `/resources/:id` | 204 No Content |

---

## 8. Database Patterns

### 8.1 Migration Strategy

**Naming Convention:**
```
[timestamp]-[description].ts
1742919331481-create-accounts-table.ts
1742919498601-create-users-table.ts
```

**Key Decisions:**
- Always use migrations, never `synchronize: true` in production
- Migrations are timestamped for deterministic ordering
- Include both `up()` and `down()` for rollback capability

### 8.2 Drizzle Migration Example

```typescript
// drizzle/migrations/0001_create_users.ts
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  // ...
});
```

### 8.3 Seeding Pattern

```typescript
// db/seed.ts
async function seed() {
  // Create test account
  const [account] = await db.insert(accounts).values({
    name: 'Test Account',
    domain: 'test.example.com',
  }).returning();

  // Create test users with different roles
  const testUsers = [
    { email: 'admin@test.com', role: 'ADMIN' },
    { email: 'manager@test.com', role: 'MANAGER' },
    { email: 'viewer@test.com', role: 'VIEWER' },
  ];

  for (const { email, role } of testUsers) {
    const [user] = await db.insert(users).values({
      email,
      name: email.split('@')[0],
    }).returning();

    await db.insert(userAccounts).values({
      userId: user.id,
      accountId: account.id,
      role,
    });
  }
}
```

---

## 9. External Service Integration

### 9.1 Auth0 Provider Abstraction

```typescript
interface IdentityProvider {
  sendInvitation(email: string, name: string): Promise<{ user: any; ticket: string }>;
  getUserByEmail(email: string): Promise<any[]>;
}

class Auth0Provider implements IdentityProvider {
  async sendInvitation(email: string, name: string) {
    // Create user in Auth0
    const user = await this.managementClient.users.create({
      email,
      name,
      connection: 'Username-Password-Authentication',
      password: generateStrongPassword(),
    });

    // Generate password reset ticket (invitation link)
    const ticket = await this.managementClient.tickets.changePassword({
      email,
      result_url: process.env.FRONTEND_URL,
    });

    return { user, ticket: ticket.ticket };
  }
}
```

### 9.2 Environment Variables for Auth0

```bash
AUTH0_DOMAIN=your-domain
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_TENANT_ID=your-tenant-id
AUTH0_REGION=us
AUTH0_CONNECTION_ID=connection-id
AUTH0_CONNECTION_TYPE=Username-Password-Authentication
JWKS_URI=https://domain.region.auth0.com/.well-known/jwks.json
IDP_ISSUER=https://domain.region.auth0.com/
IDP_AUDIENCE=boilerplate-api
```

---

## 10. Module Organization

### 10.1 Feature Module Structure

```
src/
├── routes/
│   └── users/
│       ├── index.ts      # Route definitions + handlers wiring
│       ├── routes.ts     # createRoute() definitions
│       ├── handlers.ts   # Request handlers
│       ├── schemas.ts    # Zod schemas
│       └── service.ts    # Business logic (optional)
```

### 10.2 Service Layer Pattern

```typescript
// services/users.ts
export const usersService = {
  async findAll(options: { accountId: string; page: number; limit: number }) {
    // Business logic here
  },

  async findById(id: string, accountId: string) {
    // ...
  },

  async create(data: CreateUserInput, actor: User) {
    // ...
  },
};
```

### 10.3 Dependency Flow

```
Routes (HTTP layer)
    ↓ calls
Handlers (Request/Response handling)
    ↓ calls
Services (Business logic)
    ↓ calls
Database (Drizzle queries)
```

---

## Implementation Checklist for Hono

When implementing features in Hono, ensure you cover:

- [ ] **Request Context** - Set up `c.set()`/`c.get()` for all context values
- [ ] **JWT Validation** - Implement JWKS validation for Auth0
- [ ] **Account Header** - Require and validate `account-id` header
- [ ] **Role Guards** - Create `requireRole()` and `requirePermission()` middleware
- [ ] **Super-Admin Bypass** - Check `isSuperAdmin` flag before role checks
- [ ] **Audit Logging** - Capture all entity changes with context
- [ ] **Soft Deletes** - Use `deletedAt` column, filter by default
- [ ] **Pagination** - Use consistent query params and response shape
- [ ] **Error Handling** - Standardize error response format
- [ ] **OpenAPI Docs** - Use `@hono/zod-openapi` for all routes

---

## References

- [Hono Documentation](https://hono.dev/docs/)
- [Zod OpenAPI Example](https://hono.dev/examples/zod-openapi)
- [@hono/zod-openapi](https://www.npmjs.com/package/@hono/zod-openapi)
- [Hono Best Practices](https://hono.dev/docs/guides/best-practices)
- [Hono JWT Helper](https://hono.dev/docs/helpers/jwt)
- [Hono Node.js Guide](https://hono.dev/docs/getting-started/nodejs)
- [Drizzle ORM](https://orm.drizzle.team/)
