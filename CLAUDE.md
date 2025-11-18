# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo boilerplate project offering dual frontend options (Vue 3 or React 18) with a shared NestJS backend, designed for multi-tenant SaaS applications with strict account isolation and feature-driven development.

**Technology Stack:**
- **Frontend Vue**: Vue 3, Pinia, Vue Router, Vite, TailwindCSS, @etus/design-system
- **Frontend React**: React 18, Zustand, React Router v6, Vite, TailwindCSS v4
- **Backend**: NestJS, TypeORM, SQLite (dev), Auth0 integration
- **Monorepo**: Turborepo with pnpm workspaces
- **Testing**: Vitest (Vue), React Testing Library (React), Jest (backend)

## Common Commands

### Development

```bash
# Start all services in development mode
pnpm dev

# Start specific frontend
pnpm dev:vue                     # Vue frontend on http://localhost:3000
pnpm dev:react                   # React frontend on http://localhost:3000
pnpm dev:backend                 # Backend on http://localhost:3001

# Or navigate to specific app
cd apps/frontend-vue && pnpm dev
cd apps/frontend-react && pnpm dev
cd apps/backend && pnpm dev
```

### Testing

```bash
# Run all tests across monorepo
pnpm test

# Run tests for specific app
cd apps/frontend-vue && pnpm test           # Vue unit tests with Vitest
cd apps/frontend-vue && pnpm test:coverage  # Vue coverage report
cd apps/frontend-react && pnpm test         # React unit tests
cd apps/frontend-react && pnpm test:coverage # React coverage report
cd apps/backend && pnpm test                # Backend unit tests with Jest
cd apps/backend && pnpm test:e2e            # E2E tests

# Watch mode
cd apps/frontend-vue && vitest --watch
cd apps/frontend-react && pnpm test --watch
cd apps/backend && jest --watch
```

### Build & Lint

```bash
# Build all apps
pnpm build

# Lint and format
pnpm lint                                   # Run ESLint across all apps
pnpm format                                 # Format with Prettier
cd apps/frontend-vue && pnpm type-check     # Vue TypeScript type checking
cd apps/frontend-react && pnpm type-check   # React TypeScript type checking
```

### Database Migrations

```bash
# IMPORTANT: Always ask user before running migrations
# Navigate to backend directory first
cd apps/backend

# Generate migration (after entity changes)
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource src/database/ormconfig.ts migration:generate src/database/migrations/MigrationName

# Run migrations
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource src/database/ormconfig.ts migration:run

# Run migrations and seeds (from root)
pnpm run migration
```

**CRITICAL MIGRATION RULES:**
- NEVER execute migrations automatically
- ALWAYS ask user before generating or running migrations
- PAUSE execution after entity creation/modification
- Display exact migration commands to user
- Wait for user confirmation before proceeding

## High-Level Architecture

### Monorepo Structure

```
/
├── apps/
│   └── backend/           # NestJS application
│       ├── src/
│       │   ├── modules/   # Feature modules (accounts, users, audit)
│       │   ├── entities/  # TypeORM entities
│       │   ├── auth/      # Auth0 JWT authentication
│       │   ├── database/  # Migrations, seeds, ORM config
│       │   └── common/    # Shared utilities
│       └── package.json
├── packages/              # Shared configuration packages
│   ├── eslint-config/
│   ├── typescript-config/
│   └── jest-config/
├── templates/             # Frontend templates (source of truth)
│   ├── react/             # Complete React template (284K)
│   └── vue/               # Complete Vue template (276K)
├── scripts/               # Management scripts
│   ├── add-react.sh       # Add React frontend to apps/
│   ├── add-vue.sh         # Add Vue frontend to apps/
│   └── remove-frontend.sh # Remove frontend from apps/
└── docs/                  # Project documentation
    ├── implementation_plans/  # Feature implementation plans
    └── lessons_learned/       # Architectural learnings
```

**IMPORTANT - Frontend Management:**
- Frontends are NOT included by default in `apps/` directory
- Templates in `templates/` are the single source of truth
- Users must run `bash scripts/add-react.sh` or `bash scripts/add-vue.sh` to add their chosen frontend
- This approach keeps the repository clean (~560KB vs ~150MB with node_modules)
- Frontends are gitignored once added (apps/frontend-react/ and apps/frontend-vue/)

### Account Isolation Pattern (CRITICAL)

**All database operations MUST include account context filtering.**

This is a multi-tenant architecture where every operation is scoped to an `accountId`:

- Use `accountId` from CLS (Continuation Local Storage) context in all queries
- Always filter queries by `accountId: cls.get('accountId')`
- Validate account ownership before any CRUD operation
- Pattern: `where: { accountId: this.cls.get('accountId'), deletedAt: IsNull() }`

**Backend Implementation:**
```typescript
// Services automatically filter by accountId from JWT token context
constructor(
  @InjectRepository(Entity) private repo: Repository<Entity>,
  private cls: ClsService
) {}

async findAll() {
  return this.repo.find({
    where: {
      accountId: this.cls.get('accountId'),
      deletedAt: IsNull()
    }
  });
}
```

**Frontend Implementation:**
- Account context stored in Pinia (Vue) or Zustand (React) store from Auth0 token
- All API calls include account-id header automatically via interceptors
- Features are account-scoped by default

### Soft Delete Pattern

All entities use soft deletes via `@DeleteDateColumn()`:

```typescript
@DeleteDateColumn({ name: 'deleted_at' })
deletedAt: Date;
```

- Use `softDelete()` or set `deletedAt` manually for deletions
- Always filter by `deletedAt: IsNull()` in queries
- Soft deletes trigger automatic audit logs
- NEVER use hard delete operations

### Audit System

Automatic audit logging via `AuditSubscriber`:
- Tracks all creates, updates, and soft deletes
- Includes user context from CLS
- Use `save()` instead of `update()` for audit compatibility
- Audit logs stored in `audit` table with entity snapshots

### Design System

**Vue Frontend**: Uses `@etus/design-system` component library
- Use design system components from `@etus/design-system`
- Reference Google Fonts icons: https://fonts.google.com/icons
- Validate all imports reference design system components

**React Frontend**: Uses TailwindCSS v4 for styling
- Custom components with TailwindCSS utility classes
- Google Material Icons for icons (loaded via CDN)
- Consistent styling patterns across components

**Color Standards (Both Frontends):**
- PRIMARY: Custom green for save actions
- INFO: Blue for edit/configure actions
- SUCCESS: Green for success states
- WARNING: Amber for warning states
- DANGER: Red for delete/destructive actions
- NEUTRAL: Gray variants for cancel/secondary actions

### Internationalization (i18n)

**MANDATORY**: All user-facing strings must be translated

**Vue Frontend:**
- Translations in `apps/frontend-vue/src/app/languages/locales/en.ts` and `pt.ts`
- Use `$t('key')` in templates, `t('key')` in scripts

**React Frontend:**
- Translations in `apps/frontend-react/src/app/i18n/locales/en.ts` and `pt.ts`
- Use `t('key')` from `useTranslation()` hook

**Both Frontends:**
- All labels, messages, alerts, strings must use i18n
- Bilingual support: Portuguese (default) and English

### Feature-Driven Development

Both frontends and backend follow feature-driven architecture:

**Vue Features** (`apps/frontend-vue/src/features/[feature]/`):
```
feature/
├── components/        # Feature-specific Vue components
├── composables/       # Business logic and API integration
├── stores/            # Feature state management (Pinia)
├── types/             # TypeScript interfaces and types
├── views/             # Feature pages
└── index.ts           # Feature exports
```

**React Features** (`apps/frontend-react/src/features/[feature]/`):
```
feature/
├── components/        # Feature-specific React components
├── hooks/             # Custom hooks for business logic
├── api/               # API integration
├── types/             # TypeScript interfaces and types
├── pages/             # Feature pages
├── routes.tsx         # Feature routes
└── index.ts           # Feature exports
```

**Backend Modules** (`apps/backend/src/modules/[module]/`):
```
module/
├── [entity].module.ts
├── [entity].controller.ts    # API endpoints with Swagger docs
├── [entity].service.ts       # Business logic
├── [entity].spec.ts          # Unit tests
└── dto/
    └── [entity].dto.ts       # Data Transfer Objects with validation
```

### Authentication Flow

1. **Auth0 Integration**: JWT-based authentication with Auth0
2. **Backend**: JWT validation via `JwtAuthGuard` on all protected endpoints
3. **Frontend**:
   - Vue: `@auth0/auth0-vue` for login/logout and token management
   - React: `@auth0/auth0-react` for login/logout and token management
4. **Context**: User and account context extracted from JWT and stored in:
   - Backend: CLS (Continuation Local Storage)
   - Vue: Pinia stores
   - React: Zustand stores

**All controllers must use:**
```typescript
@UseGuards(JwtAuthGuard)
@Controller('endpoint')
export class EntityController {}
```

### Database Configuration

- **Development**: SQLite (`db.sqlite`)
- **Production**: Configurable for PostgreSQL, MySQL, etc.
- **Migrations**: TypeORM migrations in `apps/backend/src/database/migrations/`
- **Seeds**: TypeORM seeds in `apps/backend/src/database/seeds/`

**Test credentials** (after running migrations):
- Email: admin@etus.com
- Password: o9ac08ZBrSgv

## Development Workflow (CRITICAL)

This project follows a **mandatory structured methodology** documented in `.cursor/rules/etus-methodology.mdc`.

**MANDATORY SEQUENCE FOR ALL DEVELOPMENT:**

1. **Analysis**: Understand the request completely
2. **Requirements**: Ask mandatory clarifying questions
3. **Investigation**: Search existing patterns in codebase
4. **Planning**: Break into phases (max 10 phases)
5. **Approval Gate**: Submit plan → WAIT for approval → Execute
6. **Sequential Execution**: Execute ONE phase at a time, submit results, wait for approval
7. **Finalization**: Validate criteria, document lessons learned

**CRITICAL RULES:**
- NEVER execute code without approved plan
- NEVER execute multiple phases simultaneously
- ALWAYS wait for explicit approval between phases
- ALWAYS respond to user in Portuguese (PT-BR)
- Code and technical docs remain in English

**Approval Pattern**: User must respond with one of: "approved", "go ahead", "pode seguir", "aprovado"

### Documentation Requirements

**MANDATORY for all features:**

1. **Implementation Plans**: `./docs/implementation_plans/yyyy_MM_dd-<feature>.md`
   - Created BEFORE execution
   - Contains phases, tasks, acceptance criteria, technical details
   - Updated with progress status

2. **Lessons Learned**: `./docs/lessons_learned/yyyy_MM_dd-<topic>.md`
   - Created AFTER completion
   - Contains architectural learnings, patterns, best practices

**Date Format**: Execute `date "+%Y_%m_%d"` to get correct format

### Correction Methodology

When user reports issues:

1. Register issue without assumptions
2. Retrieve original criteria from implementation_plan
3. Compare "what should be" vs "what is"
4. Ask specific questions about problem context
5. Collect sequential information
6. Create correction plan → WAIT for approval
7. Execute correction phases sequentially with approval gates
8. Validate resolution

## Naming Conventions

### Database & Backend
- **Database columns**: snake_case (`account_id`, `created_at`)
- **Entity properties**: camelCase (`accountId`, `createdAt`)
- **File names**: kebab-case (`user-profile.entity.ts`)
- **Class names**: PascalCase (`UserProfile`, `CreateUserDto`)

### Frontend

**Vue:**
- **Component files**: PascalCase (`UserList.vue`, `AccountSettings.vue`)
- **Composables**: camelCase with `use` prefix (`useUserData.ts`, `useAccountApi.ts`)
- **Stores**: camelCase with `Store` suffix (`userStore.ts`, `accountStore.ts`)
- **Types**: PascalCase for interfaces/types (`User`, `Account`, `ApiResponse`)

**React:**
- **Component files**: PascalCase (`UserList.tsx`, `AccountSettings.tsx`)
- **Hooks**: camelCase with `use` prefix (`useUserData.ts`, `useAuth.ts`)
- **Stores**: camelCase with `Store` suffix (`mainStore.ts`)
- **Types**: PascalCase for interfaces/types (`User`, `Account`, `ApiResponse`)

## Code Quality Standards

### Backend
- Use `save()` instead of `update()` for audit compatibility
- Include API documentation with Swagger decorators
- Input validation with DTOs and `class-validator`
- Proper error handling with custom exceptions
- Account isolation in ALL database queries
- Soft delete pattern consistently applied

### Frontend (Both Vue and React)
- Implement loading, error, and empty states for all data displays
- Mobile-first responsive design
- Comprehensive i18n for all user-facing strings
- Feature isolation with minimal cross-feature coupling
- TypeScript strict mode enabled
- Consistent error handling and user feedback
- Route guards for protected pages

### General
- DRY principle: Check for existing functionality before implementing
- Single responsibility per function/class
- Clear, descriptive naming
- Conservative changes: Exhaust existing patterns before introducing new ones
- TypeScript strict mode throughout

## Environment Setup

### Initial Setup

```bash
# Clone and install dependencies
git clone <repo-url> project-name
cd project-name
pnpm install

# Configure environment
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend-vue/.env.example apps/frontend-vue/.env
cp apps/frontend-react/.env.example apps/frontend-react/.env

# Run migrations and seeds
pnpm run migration
```

### Required Environment Variables

**Backend** (`apps/backend/.env`):
- `JWKS_URI`: Auth0 JWKS endpoint
- `IDP_ISSUER`: Auth0 issuer URL
- `IDP_AUDIENCE`: API audience identifier
- `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`: Auth0 credentials
- `PORT`: Backend port (default: 3001)
- `NODE_ENV`: Environment (development/production)

**Frontend Vue** (`apps/frontend-vue/.env`):
- `VITE_AUTH0_DOMAIN`: Auth0 domain
- `VITE_AUTH0_CLIENT_ID`: SPA Client ID
- `VITE_AUTH0_REDIRECT_URI`: Callback URL
- `VITE_AUTH0_AUDIENCE`: API audience
- `VITE_BACKEND_URL`: Backend API URL

**Frontend React** (`apps/frontend-react/.env`):
- `VITE_AUTH0_DOMAIN`: Auth0 domain
- `VITE_AUTH0_CLIENT_ID`: SPA Client ID
- `VITE_AUTH0_REDIRECT_URI`: Callback URL
- `VITE_AUTH0_AUDIENCE`: API audience
- `VITE_BACKEND_URL`: Backend API URL

**CRITICAL**: Never overwrite `.env` files without explicit user confirmation

## Additional Resources

- **Cursor Rules**: `.cursor/rules/` contains comprehensive development rules
- **Project Context**: `.cursor/rules/project-context.mdc` for project-specific patterns
- **TypeScript Standards**: `.cursor/rules/typescript.mdc` for coding standards
- **Backend Rules**: `.cursor/rules/backend/` for backend-specific patterns
- **Frontend Rules**: `.cursor/rules/frontend/` for frontend-specific patterns
- **Development Methodology**: `docs/development_methodology_for_developers.md` for detailed workflow
