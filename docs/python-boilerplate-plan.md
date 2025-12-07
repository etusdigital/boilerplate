# Python Boilerplate Plan

This document outlines a plan to create a backend boilerplate using Python (FastAPI), preserving all architectural patterns and system design decisions from the NestJS boilerplate.

---

## Technology Decisions

### Framework: FastAPI

**Why FastAPI over alternatives:**

| Framework | Pros | Cons | Decision |
|-----------|------|------|----------|
| **FastAPI** | Async, OpenAPI built-in, Pydantic validation, dependency injection, type hints | Relatively new | **Selected** |
| Flask | Simple, mature ecosystem | No async, no built-in validation, manual OpenAPI | Not selected |
| Django | Batteries included, mature | Opinionated ORM, synchronous by default, heavy | Not selected |
| Litestar | Modern, performant | Smaller ecosystem than FastAPI | Not selected |

**FastAPI aligns with our architecture because:**
- Built-in OpenAPI/Swagger (like `@hono/zod-openapi`)
- Pydantic for validation (like Zod)
- Dependency injection system (cleaner than NestJS DI)
- Async-first design (like Hono)
- Type hints throughout

### ORM: SQLAlchemy 2.0

**Why SQLAlchemy 2.0:**
- Industry standard, mature, well-documented
- Excellent async support in 2.0
- Works with Alembic for migrations
- `mapped_column` for clean typing
- Flexible query builder

**Alternative considered:** SQLModel (combines SQLAlchemy + Pydantic) - simpler but less control.

### Key Technology Stack

```
Framework:      FastAPI 0.115+
ORM:            SQLAlchemy 2.0+
Migrations:     Alembic
Validation:     Pydantic v2
Auth:           python-jose (JWT), httpx (JWKS)
Server:         Uvicorn
Database:       SQLite (dev), PostgreSQL (prod)
Testing:        pytest, pytest-asyncio, httpx
```

---

## Pattern Mapping: NestJS/Hono → Python/FastAPI

| NestJS/Hono Concept | Python/FastAPI Equivalent |
|---------------------|---------------------------|
| `@hono/zod-openapi` | FastAPI + Pydantic (built-in) |
| `createRoute()` | `@router.get()` / `@router.post()` decorators |
| `c.set()` / `c.get()` | `contextvars` module |
| `createMiddleware()` | FastAPI Middleware or `Depends()` |
| Zod schemas | Pydantic `BaseModel` |
| TypeORM entities | SQLAlchemy models |
| TypeORM migrations | Alembic migrations |
| NestJS Guards | FastAPI dependencies with `Depends()` |
| NestJS Modules | Python packages |
| class-validator | Pydantic validators |
| CLS (nestjs-cls) | Python `contextvars` |
| TypeORM Subscribers | SQLAlchemy event listeners |

---

## Project Structure

```
src/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app factory
│   ├── config.py                  # Pydantic Settings
│   ├── dependencies.py            # Shared dependencies
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── request_context.py     # Request ID, IP, User-Agent
│   │   ├── account.py             # Account header validation
│   │   └── error_handler.py       # Global exception handlers
│   │
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt.py                 # JWT validation, JWKS
│   │   ├── dependencies.py        # get_current_user, require_role
│   │   ├── roles.py               # Role enum, hierarchy
│   │   ├── permissions.py         # Permission enum, matrix
│   │   └── auth0_provider.py      # Auth0 Management API
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py             # Async session factory
│   │   ├── base.py                # Base model classes
│   │   └── migrations/            # Alembic migrations
│   │       ├── versions/
│   │       ├── env.py
│   │       └── alembic.ini
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── user_account.py
│   │   └── audit_log.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                # Pydantic schemas
│   │   ├── account.py
│   │   ├── pagination.py
│   │   └── common.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   ├── account_service.py
│   │   └── audit_service.py
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── router.py              # Main router aggregation
│   │   ├── users.py
│   │   └── accounts.py
│   │
│   ├── context/
│   │   ├── __init__.py
│   │   └── request_context.py     # contextvars implementation
│   │
│   └── lib/
│       ├── __init__.py
│       ├── pagination.py          # Pagination utilities
│       └── errors.py              # Custom exceptions
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # Fixtures
│   ├── test_users.py
│   └── test_accounts.py
│
├── scripts/
│   └── seed.py                    # Database seeding
│
├── pyproject.toml                 # Project config (Poetry/uv)
├── alembic.ini
├── .env.example
└── README.md
```

---

## Core Dependencies

```toml
# pyproject.toml
[project]
name = "etus-boilerplate"
version = "1.0.0"
requires-python = ">=3.11"

dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.30.0",
    "sqlalchemy[asyncio]>=2.0.0",
    "alembic>=1.13.0",
    "aiosqlite>=0.19.0",           # SQLite async driver
    "asyncpg>=0.29.0",             # PostgreSQL async driver
    "pydantic>=2.0.0",
    "pydantic-settings>=2.0.0",
    "python-jose[cryptography]>=3.3.0",
    "httpx>=0.27.0",               # For JWKS fetching
    "auth0-python>=4.0.0",         # Auth0 Management API
    "python-multipart>=0.0.9",     # Form data support
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "httpx>=0.27.0",               # Test client
    "ruff>=0.4.0",                 # Linting
    "mypy>=1.10.0",                # Type checking
]
```

---

## Implementation Details

### 1. Configuration with Pydantic Settings

```python
# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings with environment variable validation."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    app_name: str = "Etus API"
    debug: bool = False
    port: int = 8000

    # Database
    database_url: str = "sqlite+aiosqlite:///./db.sqlite"
    database_echo: bool = False

    # Auth0 / JWT
    jwks_uri: str
    idp_issuer: str
    idp_audience: str
    auth0_domain: str
    auth0_client_id: str
    auth0_client_secret: str
    auth0_connection_id: str
    auth0_region: str = "us"

    # Frontend
    frontend_url: str = "http://localhost:3000"


@lru_cache
def get_settings() -> Settings:
    return Settings()
```

### 2. Request Context with contextvars

```python
# app/context/request_context.py
from contextvars import ContextVar
from dataclasses import dataclass
from typing import Optional
from uuid import uuid4
import time


@dataclass
class RequestContext:
    """Request-scoped context data."""
    request_id: str
    transaction_id: str
    ip_address: str
    user_agent: str
    account_id: Optional[str] = None
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    user_role: Optional[str] = None
    is_super_admin: bool = False
    is_system_admin_access: bool = False
    timestamp: float = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = time.time()


# Context variable for request-scoped data
_request_context: ContextVar[Optional[RequestContext]] = ContextVar(
    "request_context",
    default=None
)


def get_request_context() -> RequestContext:
    """Get the current request context."""
    ctx = _request_context.get()
    if ctx is None:
        raise RuntimeError("Request context not initialized")
    return ctx


def set_request_context(ctx: RequestContext) -> None:
    """Set the current request context."""
    _request_context.set(ctx)


def create_request_context(
    ip_address: str,
    user_agent: str,
) -> RequestContext:
    """Create a new request context."""
    from uuid import uuid4

    # UUID v7 would be ideal, but uuid4 works
    # Can use uuid7 library for sortable IDs
    ctx = RequestContext(
        request_id=str(uuid4()),
        transaction_id=str(uuid4()),
        ip_address=ip_address,
        user_agent=user_agent or "",
    )
    set_request_context(ctx)
    return ctx
```

### 3. Database Setup with SQLAlchemy 2.0

```python
# app/db/session.py
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from app.config import get_settings


settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    echo=settings.database_echo,
    future=True,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncSession:
    """Dependency for database session."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### 4. Base Model Classes

```python
# app/db/base.py
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, String, ForeignKey, func
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    declared_attr,
)
from uuid import uuid4


class Base(DeclarativeBase):
    """Base class for all models."""
    pass


class SoftDeleteMixin:
    """Mixin for soft delete support with timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )

    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None


class InteractiveMixin(SoftDeleteMixin):
    """Mixin for tracking who created/updated/deleted records."""

    @declared_attr
    def created_by_id(cls) -> Mapped[Optional[str]]:
        return mapped_column(
            String(36),
            ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        )

    @declared_attr
    def updated_by_id(cls) -> Mapped[Optional[str]]:
        return mapped_column(
            String(36),
            ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        )

    @declared_attr
    def deleted_by_id(cls) -> Mapped[Optional[str]]:
        return mapped_column(
            String(36),
            ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        )


def generate_uuid() -> str:
    """Generate a UUID string."""
    return str(uuid4())
```

### 5. Entity Models

```python
# app/models/user.py
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, InteractiveMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.user_account import UserAccount


class User(Base, InteractiveMixin):
    """User entity with multi-provider support."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    profile_image: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="pending",
        nullable=False,
    )

    # Array of identity provider IDs (e.g., auth0|xxx, google-oauth2|xxx)
    provider_ids: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    is_super_admin: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # Relationships
    user_accounts: Mapped[List["UserAccount"]] = relationship(
        "UserAccount",
        back_populates="user",
        lazy="selectin",  # Eager load
    )

    def has_provider(self, provider_id: str) -> bool:
        """Check if user has a specific provider ID."""
        return provider_id in self.provider_ids

    def add_provider(self, provider_id: str) -> None:
        """Add a provider ID to the user."""
        if provider_id not in self.provider_ids:
            self.provider_ids = [*self.provider_ids, provider_id]

    def remove_provider(self, provider_id: str) -> None:
        """Remove a provider ID from the user."""
        self.provider_ids = [p for p in self.provider_ids if p != provider_id]
```

```python
# app/models/account.py
from typing import Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base, SoftDeleteMixin, generate_uuid


class Account(Base, SoftDeleteMixin):
    """Tenant/Organization entity."""

    __tablename__ = "accounts"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True,
    )

    domain: Mapped[Optional[str]] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )
```

```python
# app/models/user_account.py
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.auth.roles import Role

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.account import Account


class UserAccount(Base):
    """Junction table for user-account relationships with role."""

    __tablename__ = "user_accounts"
    __table_args__ = (
        UniqueConstraint("account_id", "user_id", name="uq_account_user"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
    )

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    account_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role: Mapped[str] = mapped_column(
        String(50),
        default=Role.VIEWER,
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="user_accounts",
    )

    account: Mapped["Account"] = relationship(
        "Account",
        lazy="selectin",
    )
```

```python
# app/models/audit_log.py
from datetime import datetime
from typing import Optional, Any
from sqlalchemy import String, DateTime, JSON, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base, generate_uuid


class AuditLog(Base):
    """Immutable audit trail for entity changes."""

    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )

    transaction_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
        index=True,
    )

    account_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("accounts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    entity: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    entity_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
    )

    action: Mapped[str] = mapped_column(
        String(20),  # INSERT, UPDATE, DELETE
        nullable=False,
    )

    changes: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
    )

    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45),  # IPv6 max length
        nullable=True,
    )

    user_agent: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
```

### 6. Roles and Permissions

```python
# app/auth/roles.py
from enum import Enum
from typing import List, Optional


class Role(str, Enum):
    """User roles with hierarchy."""
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    EDITOR = "EDITOR"
    AUTHOR = "AUTHOR"
    VIEWER = "VIEWER"
    BILLING = "BILLING"
    ANALYTICS = "ANALYTICS"


# Role hierarchy: lower number = higher privilege
ROLE_HIERARCHY: dict[Role, int] = {
    Role.ADMIN: 0,
    Role.MANAGER: 1,
    Role.EDITOR: 2,
    Role.AUTHOR: 3,
    Role.VIEWER: 4,
    Role.BILLING: -1,     # Non-hierarchical
    Role.ANALYTICS: -1,   # Non-hierarchical
}


def has_minimum_role(
    user_role: Role,
    required_role: Role,
    additional_roles: Optional[List[Role]] = None,
) -> bool:
    """
    Check if user has minimum required role.

    Hierarchical roles: ADMIN > MANAGER > EDITOR > AUTHOR > VIEWER
    Special roles (BILLING, ANALYTICS) are non-hierarchical.
    """
    # Check non-hierarchical additional roles first
    if additional_roles and user_role in additional_roles:
        return True

    user_level = ROLE_HIERARCHY.get(user_role, 999)
    required_level = ROLE_HIERARCHY.get(required_role, 999)

    # Special roles (-1) can't access hierarchical endpoints
    if user_level == -1:
        return False
    if required_level == -1:
        return False

    # Lower number = higher privilege
    return user_level <= required_level


def get_role_display_name(role: Role) -> str:
    """Get human-readable role name."""
    return role.value.replace("_", " ").title()
```

```python
# app/auth/permissions.py
from enum import Enum
from typing import List
from app.auth.roles import Role


class Permission(str, Enum):
    """Fine-grained permissions."""
    # System
    MANAGE_SYSTEM_SETTINGS = "MANAGE_SYSTEM_SETTINGS"

    # Users
    MANAGE_ALL_USERS = "MANAGE_ALL_USERS"
    MANAGE_TEAM_USERS = "MANAGE_TEAM_USERS"
    VIEW_ALL_USERS = "VIEW_ALL_USERS"

    # Content
    CREATE_CONTENT = "CREATE_CONTENT"
    EDIT_ALL_CONTENT = "EDIT_ALL_CONTENT"
    EDIT_OWN_CONTENT = "EDIT_OWN_CONTENT"
    DELETE_CONTENT = "DELETE_CONTENT"
    PUBLISH_CONTENT = "PUBLISH_CONTENT"
    VIEW_CONTENT = "VIEW_CONTENT"

    # Analytics & Billing
    VIEW_ANALYTICS = "VIEW_ANALYTICS"
    MANAGE_BILLING = "MANAGE_BILLING"
    VIEW_BILLING = "VIEW_BILLING"


# Permission matrix: role -> list of permissions
ROLE_PERMISSIONS: dict[Role, List[Permission]] = {
    Role.ADMIN: [
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

    Role.MANAGER: [
        Permission.MANAGE_TEAM_USERS,
        Permission.VIEW_ALL_USERS,
        Permission.CREATE_CONTENT,
        Permission.EDIT_ALL_CONTENT,
        Permission.PUBLISH_CONTENT,
        Permission.VIEW_CONTENT,
        Permission.VIEW_ANALYTICS,
    ],

    Role.EDITOR: [
        Permission.CREATE_CONTENT,
        Permission.EDIT_ALL_CONTENT,
        Permission.PUBLISH_CONTENT,
        Permission.VIEW_CONTENT,
    ],

    Role.AUTHOR: [
        Permission.CREATE_CONTENT,
        Permission.EDIT_OWN_CONTENT,
        Permission.VIEW_CONTENT,
    ],

    Role.VIEWER: [
        Permission.VIEW_CONTENT,
    ],

    Role.BILLING: [
        Permission.MANAGE_BILLING,
        Permission.VIEW_BILLING,
    ],

    Role.ANALYTICS: [
        Permission.VIEW_ANALYTICS,
    ],
}


def has_permission(role: Role, permission: Permission) -> bool:
    """Check if role has a specific permission."""
    return permission in ROLE_PERMISSIONS.get(role, [])


def has_any_permission(role: Role, permissions: List[Permission]) -> bool:
    """Check if role has any of the given permissions."""
    role_perms = ROLE_PERMISSIONS.get(role, [])
    return any(p in role_perms for p in permissions)


def has_all_permissions(role: Role, permissions: List[Permission]) -> bool:
    """Check if role has all of the given permissions."""
    role_perms = ROLE_PERMISSIONS.get(role, [])
    return all(p in role_perms for p in permissions)
```

### 7. JWT Authentication

```python
# app/auth/jwt.py
from datetime import datetime, timezone
from typing import Optional, Any
import httpx
from jose import jwt, JWTError, jwk
from jose.exceptions import JWKError
from pydantic import BaseModel
from functools import lru_cache
from app.config import get_settings


class TokenPayload(BaseModel):
    """Decoded JWT token payload."""
    sub: str                          # Subject (user ID in Auth0)
    iss: str                          # Issuer
    aud: list[str] | str              # Audience
    exp: int                          # Expiration
    iat: int                          # Issued at
    email: Optional[str] = None
    permissions: list[str] = []
    identities: list[str] = []

    # Custom claims (namespace varies)
    roles: list[str] = []

    class Config:
        extra = "allow"  # Allow additional claims


class JWKSClient:
    """Client for fetching and caching JWKS keys."""

    def __init__(self, jwks_uri: str, cache_ttl: int = 3600):
        self.jwks_uri = jwks_uri
        self.cache_ttl = cache_ttl
        self._keys: dict[str, Any] = {}
        self._last_fetch: Optional[datetime] = None

    async def get_signing_key(self, kid: str) -> Any:
        """Get signing key by key ID."""
        await self._refresh_keys_if_needed()

        if kid not in self._keys:
            # Force refresh if key not found
            await self._fetch_keys()

        if kid not in self._keys:
            raise JWKError(f"Key {kid} not found in JWKS")

        return self._keys[kid]

    async def _refresh_keys_if_needed(self) -> None:
        """Refresh keys if cache is stale."""
        now = datetime.now(timezone.utc)

        if self._last_fetch is None:
            await self._fetch_keys()
        elif (now - self._last_fetch).total_seconds() > self.cache_ttl:
            await self._fetch_keys()

    async def _fetch_keys(self) -> None:
        """Fetch keys from JWKS endpoint."""
        async with httpx.AsyncClient() as client:
            response = await client.get(self.jwks_uri)
            response.raise_for_status()

            jwks = response.json()

            self._keys = {}
            for key_data in jwks.get("keys", []):
                if key_data.get("use") == "sig":
                    kid = key_data.get("kid")
                    if kid:
                        self._keys[kid] = jwk.construct(key_data)

            self._last_fetch = datetime.now(timezone.utc)


# Singleton JWKS client
@lru_cache
def get_jwks_client() -> JWKSClient:
    settings = get_settings()
    return JWKSClient(settings.jwks_uri)


async def decode_token(token: str) -> TokenPayload:
    """Decode and validate a JWT token."""
    settings = get_settings()
    jwks_client = get_jwks_client()

    try:
        # Get unverified header to find key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        if not kid:
            raise JWTError("Token missing key ID")

        # Get signing key
        signing_key = await jwks_client.get_signing_key(kid)

        # Decode and verify token
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=settings.idp_audience,
            issuer=settings.idp_issuer,
        )

        # Extract roles from custom claim namespace
        roles_claim = settings.auth0_roles_name if hasattr(settings, 'auth0_roles_name') else None
        roles = []
        if roles_claim and roles_claim in payload:
            roles = payload[roles_claim]

        return TokenPayload(
            sub=payload["sub"],
            iss=payload["iss"],
            aud=payload.get("aud", []),
            exp=payload["exp"],
            iat=payload["iat"],
            email=payload.get("email"),
            permissions=payload.get("permissions", []),
            identities=payload.get("identities", []),
            roles=roles,
        )

    except JWTError as e:
        raise ValueError(f"Invalid token: {e}")
```

### 8. Authentication Dependencies

```python
# app/auth/dependencies.py
from typing import Optional, List, Annotated
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.user_account import UserAccount
from app.auth.jwt import decode_token, TokenPayload
from app.auth.roles import Role, has_minimum_role
from app.auth.permissions import Permission, has_permission
from app.context.request_context import get_request_context, RequestContext


security = HTTPBearer(auto_error=False)


async def get_token_payload(
    credentials: Annotated[
        Optional[HTTPAuthorizationCredentials],
        Depends(security)
    ],
) -> TokenPayload:
    """Extract and validate JWT token from Authorization header."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = await decode_token(credentials.credentials)
        return payload
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    token: Annotated[TokenPayload, Depends(get_token_payload)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Get current user from database based on JWT token."""
    # Find user by provider ID
    result = await db.execute(
        select(User).where(
            User.provider_ids.contains([token.sub])
        )
    )
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if user.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated",
        )

    return user


async def get_account_id(
    account_id: Annotated[Optional[str], Header(alias="account-id")] = None,
) -> str:
    """Extract and validate account-id header."""
    if not account_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="account-id header is required",
        )
    return account_id


async def get_user_account(
    user: Annotated[User, Depends(get_current_user)],
    account_id: Annotated[str, Depends(get_account_id)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Optional[UserAccount]:
    """Get user's membership in the specified account."""
    # Super admin bypass - they have access to all accounts
    if user.is_super_admin:
        return None  # No specific membership needed

    result = await db.execute(
        select(UserAccount).where(
            UserAccount.user_id == user.id,
            UserAccount.account_id == account_id,
        )
    )
    return result.scalar_one_or_none()


async def get_current_user_with_account(
    user: Annotated[User, Depends(get_current_user)],
    account_id: Annotated[str, Depends(get_account_id)],
    user_account: Annotated[Optional[UserAccount], Depends(get_user_account)],
) -> tuple[User, str, Optional[Role]]:
    """
    Get current user with account context.
    Returns (user, account_id, role).
    """
    # Super admin bypass
    if user.is_super_admin:
        # Update request context
        ctx = get_request_context()
        ctx.user_id = user.id
        ctx.user_email = user.email
        ctx.account_id = account_id
        ctx.is_super_admin = True
        ctx.is_system_admin_access = True
        ctx.user_role = Role.ADMIN.value

        return (user, account_id, Role.ADMIN)

    # Check membership
    if user_account is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No access to this account",
        )

    role = Role(user_account.role)

    # Update request context
    ctx = get_request_context()
    ctx.user_id = user.id
    ctx.user_email = user.email
    ctx.account_id = account_id
    ctx.user_role = role.value

    return (user, account_id, role)


def require_role(
    min_role: Role,
    additional_roles: Optional[List[Role]] = None,
):
    """
    Dependency factory for role-based access control.

    Usage:
        @router.get("/admin-only")
        async def admin_endpoint(
            auth: Annotated[tuple, Depends(require_role(Role.ADMIN))]
        ):
            user, account_id, role = auth
            ...
    """
    async def dependency(
        auth: Annotated[
            tuple[User, str, Optional[Role]],
            Depends(get_current_user_with_account)
        ],
    ) -> tuple[User, str, Role]:
        user, account_id, role = auth

        # Super admin always passes
        if user.is_super_admin:
            return (user, account_id, Role.ADMIN)

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No role assigned",
            )

        if not has_minimum_role(role, min_role, additional_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {min_role.value} role or higher",
            )

        return (user, account_id, role)

    return dependency


def require_permission(permission: Permission):
    """
    Dependency factory for permission-based access control.

    Usage:
        @router.delete("/content/{id}")
        async def delete_content(
            auth: Annotated[tuple, Depends(require_permission(Permission.DELETE_CONTENT))]
        ):
            user, account_id, role = auth
            ...
    """
    async def dependency(
        auth: Annotated[
            tuple[User, str, Optional[Role]],
            Depends(get_current_user_with_account)
        ],
    ) -> tuple[User, str, Role]:
        user, account_id, role = auth

        # Super admin always passes
        if user.is_super_admin:
            return (user, account_id, Role.ADMIN)

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No role assigned",
            )

        if not has_permission(role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing permission: {permission.value}",
            )

        return (user, account_id, role)

    return dependency
```

### 9. Middleware

```python
# app/middleware/request_context.py
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.context.request_context import create_request_context


class RequestContextMiddleware(BaseHTTPMiddleware):
    """Middleware to initialize request context for each request."""

    async def dispatch(self, request: Request, call_next) -> Response:
        # Get client IP (handle proxies)
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            ip_address = forwarded_for.split(",")[0].strip()
        else:
            ip_address = request.client.host if request.client else "unknown"

        # Get user agent
        user_agent = request.headers.get("user-agent", "")

        # Create request context
        create_request_context(
            ip_address=ip_address,
            user_agent=user_agent,
        )

        response = await call_next(request)
        return response
```

```python
# app/middleware/error_handler.py
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

logger = logging.getLogger(__name__)


async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
) -> JSONResponse:
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "statusCode": exc.status_code,
            "message": exc.detail,
            "error": _get_error_name(exc.status_code),
        },
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """Handle Pydantic validation errors."""
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        errors.append(f"{field}: {error['msg']}")

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "statusCode": 400,
            "message": errors,
            "error": "Bad Request",
        },
    )


async def general_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """Handle unhandled exceptions."""
    logger.exception("Unhandled exception", exc_info=exc)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "statusCode": 500,
            "message": "Internal server error",
            "error": "Internal Server Error",
        },
    )


def _get_error_name(status_code: int) -> str:
    """Get error name for status code."""
    names = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        409: "Conflict",
        422: "Unprocessable Entity",
        500: "Internal Server Error",
    }
    return names.get(status_code, "Error")
```

### 10. Pydantic Schemas

```python
# app/schemas/common.py
from typing import TypeVar, Generic, List, Optional
from pydantic import BaseModel, ConfigDict


T = TypeVar("T")


class PaginationMeta(BaseModel):
    """Pagination metadata."""
    current_page: int
    limit: int
    total_items: int
    total_pages: int
    has_previous_page: bool
    has_next_page: bool


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response."""
    data: List[T]
    meta: PaginationMeta


def create_pagination_meta(
    total_items: int,
    page: int,
    limit: int,
) -> PaginationMeta:
    """Create pagination metadata."""
    total_pages = (total_items + limit - 1) // limit if limit > 0 else 0

    return PaginationMeta(
        current_page=page,
        limit=limit,
        total_items=total_items,
        total_pages=total_pages,
        has_previous_page=page > 1,
        has_next_page=page < total_pages,
    )
```

```python
# app/schemas/pagination.py
from typing import Optional, Literal
from pydantic import BaseModel, Field


class PaginationQuery(BaseModel):
    """Query parameters for pagination."""
    page: int = Field(default=1, ge=1, description="Page number")
    limit: int = Field(default=50, ge=1, le=100, description="Items per page")
    sort_by: Optional[str] = Field(default=None, description="Field to sort by")
    sort_order: Literal["asc", "desc"] = Field(default="desc", description="Sort order")
```

```python
# app/schemas/user.py
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserAccountSchema(BaseModel):
    """User's account membership."""
    account_id: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    profile_image: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a user."""
    account_ids: Optional[List[str]] = None


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    profile_image: Optional[str] = None
    status: Optional[str] = None


class UserResponse(UserBase):
    """Schema for user response."""
    id: str
    status: str
    is_super_admin: bool
    created_at: datetime
    updated_at: datetime
    user_accounts: List[UserAccountSchema] = []

    model_config = ConfigDict(from_attributes=True)


class UserBrief(BaseModel):
    """Brief user info for lists."""
    id: str
    email: str
    name: str
    status: str

    model_config = ConfigDict(from_attributes=True)
```

```python
# app/schemas/account.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class AccountBase(BaseModel):
    """Base account schema."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    domain: Optional[str] = Field(None, max_length=255)


class AccountCreate(AccountBase):
    """Schema for creating an account."""
    pass


class AccountUpdate(BaseModel):
    """Schema for updating an account."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    domain: Optional[str] = Field(None, max_length=255)


class AccountResponse(AccountBase):
    """Schema for account response."""
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
```

### 11. Services

```python
# app/services/user_service.py
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.models.user_account import UserAccount
from app.models.account import Account
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.pagination import PaginationQuery
from app.schemas.common import create_pagination_meta, PaginationMeta
from app.auth.roles import Role
from app.context.request_context import get_request_context


class UserService:
    """Service for user operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_by_id(self, user_id: str) -> Optional[User]:
        """Find user by ID."""
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.user_accounts))
            .where(User.id == user_id, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def find_by_email(self, email: str) -> Optional[User]:
        """Find user by email."""
        result = await self.db.execute(
            select(User)
            .where(User.email == email, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def find_by_provider_id(self, provider_id: str) -> Optional[User]:
        """Find user by provider ID."""
        # SQLite uses JSON, need to check if array contains value
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.user_accounts))
            .where(
                User.provider_ids.contains([provider_id]),
                User.deleted_at.is_(None),
            )
        )
        return result.scalar_one_or_none()

    async def find_all_paginated(
        self,
        pagination: PaginationQuery,
        account_id: Optional[str] = None,
        is_super_admin: bool = False,
    ) -> Tuple[List[User], PaginationMeta]:
        """Find all users with pagination."""
        query = (
            select(User)
            .options(selectinload(User.user_accounts))
            .where(User.deleted_at.is_(None))
        )

        # Filter by account if not super admin
        if not is_super_admin and account_id:
            query = query.join(UserAccount).where(
                UserAccount.account_id == account_id
            )

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total_items = total_result.scalar() or 0

        # Apply sorting
        sort_column = getattr(User, pagination.sort_by or "created_at", User.created_at)
        if pagination.sort_order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # Apply pagination
        offset = (pagination.page - 1) * pagination.limit
        query = query.offset(offset).limit(pagination.limit)

        result = await self.db.execute(query)
        users = list(result.scalars().all())

        meta = create_pagination_meta(total_items, pagination.page, pagination.limit)

        return users, meta

    async def create(
        self,
        data: UserCreate,
        actor: Optional[User] = None,
    ) -> User:
        """Create a new user."""
        user = User(
            email=data.email,
            name=data.name,
            profile_image=data.profile_image,
            status="pending",
            provider_ids=[],
            created_by_id=actor.id if actor else None,
        )

        self.db.add(user)
        await self.db.flush()

        # Create user-account relationships
        if data.account_ids:
            for account_id in data.account_ids:
                user_account = UserAccount(
                    id=str(uuid4()),
                    user_id=user.id,
                    account_id=account_id,
                    role=Role.VIEWER.value,
                )
                self.db.add(user_account)

        await self.db.flush()
        await self.db.refresh(user)

        return user

    async def update(
        self,
        user: User,
        data: UserUpdate,
        actor: Optional[User] = None,
    ) -> User:
        """Update an existing user."""
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(user, field, value)

        user.updated_by_id = actor.id if actor else None

        await self.db.flush()
        await self.db.refresh(user)

        return user

    async def soft_delete(
        self,
        user: User,
        actor: Optional[User] = None,
    ) -> None:
        """Soft delete a user."""
        from datetime import datetime, timezone

        user.deleted_at = datetime.now(timezone.utc)
        user.deleted_by_id = actor.id if actor else None

        await self.db.flush()


from uuid import uuid4
```

### 12. Routes

```python
# app/routes/users.py
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserBrief
from app.schemas.pagination import PaginationQuery
from app.schemas.common import PaginatedResponse
from app.services.user_service import UserService
from app.auth.dependencies import require_role, get_current_user_with_account
from app.auth.roles import Role


router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "",
    response_model=PaginatedResponse[UserBrief],
    summary="List users",
    description="Get paginated list of users. Requires MANAGER role or higher.",
)
async def list_users(
    auth: Annotated[tuple[User, str, Role], Depends(require_role(Role.MANAGER))],
    db: Annotated[AsyncSession, Depends(get_db)],
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
):
    """List all users with pagination."""
    user, account_id, role = auth

    service = UserService(db)
    pagination = PaginationQuery(
        page=page,
        limit=limit,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    users, meta = await service.find_all_paginated(
        pagination=pagination,
        account_id=account_id,
        is_super_admin=user.is_super_admin,
    )

    return PaginatedResponse(
        data=[UserBrief.model_validate(u) for u in users],
        meta=meta,
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user by ID",
    description="Get a specific user by ID. Requires MANAGER role or higher.",
)
async def get_user(
    user_id: str,
    auth: Annotated[tuple[User, str, Role], Depends(require_role(Role.MANAGER))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get a specific user by ID."""
    service = UserService(db)
    user = await service.find_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return UserResponse.model_validate(user)


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create user",
    description="Create a new user. Requires ADMIN role.",
)
async def create_user(
    data: UserCreate,
    auth: Annotated[tuple[User, str, Role], Depends(require_role(Role.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Create a new user."""
    actor, account_id, role = auth

    service = UserService(db)

    # Check if email already exists
    existing = await service.find_by_email(data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )

    user = await service.create(data, actor)

    # TODO: Send invitation via Auth0

    return UserResponse.model_validate(user)


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update user",
    description="Update an existing user. Requires ADMIN role.",
)
async def update_user(
    user_id: str,
    data: UserUpdate,
    auth: Annotated[tuple[User, str, Role], Depends(require_role(Role.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Update an existing user."""
    actor, account_id, role = auth

    service = UserService(db)
    user = await service.find_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    updated_user = await service.update(user, data, actor)
    return UserResponse.model_validate(updated_user)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
    description="Soft delete a user. Requires ADMIN role.",
)
async def delete_user(
    user_id: str,
    auth: Annotated[tuple[User, str, Role], Depends(require_role(Role.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Soft delete a user."""
    actor, account_id, role = auth

    service = UserService(db)
    user = await service.find_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    await service.soft_delete(user, actor)
```

```python
# app/routes/router.py
from fastapi import APIRouter
from app.routes import users, accounts

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(users.router)
api_router.include_router(accounts.router)
```

### 13. Main Application

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import get_settings
from app.routes.router import api_router
from app.middleware.request_context import RequestContextMiddleware
from app.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    settings = get_settings()
    print(f"Starting {settings.app_name}")

    yield

    # Shutdown
    print("Shutting down")


def create_app() -> FastAPI:
    """Application factory."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request context middleware
    app.add_middleware(RequestContextMiddleware)

    # Exception handlers
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    # Routes
    app.include_router(api_router)

    # Health check
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "ok"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    settings = get_settings()
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.debug,
    )
```

### 14. Audit Logging with SQLAlchemy Events

```python
# app/services/audit_service.py
from typing import Any, Optional
from sqlalchemy import event
from sqlalchemy.orm import Session, Mapper
from sqlalchemy.orm.attributes import get_history

from app.models.audit_log import AuditLog
from app.context.request_context import get_request_context
from app.db.base import generate_uuid


def get_changes(instance: Any) -> dict[str, Any]:
    """Get changed attributes of an instance."""
    changes = {}

    for attr in instance.__mapper__.columns.keys():
        history = get_history(instance, attr)

        if history.has_changes():
            old_value = history.deleted[0] if history.deleted else None
            new_value = history.added[0] if history.added else None

            changes[attr] = {
                "old": old_value,
                "new": new_value,
            }

    return changes


def create_audit_log(
    session: Session,
    entity: str,
    entity_id: str,
    action: str,
    changes: Optional[dict] = None,
) -> None:
    """Create an audit log entry."""
    try:
        ctx = get_request_context()

        audit_log = AuditLog(
            id=generate_uuid(),
            transaction_id=ctx.transaction_id,
            account_id=ctx.account_id,
            user_id=ctx.user_id,
            entity=entity,
            entity_id=entity_id,
            action=action,
            changes=changes,
            ip_address=ctx.ip_address,
            user_agent=ctx.user_agent,
        )

        session.add(audit_log)
    except RuntimeError:
        # No request context (e.g., during migrations)
        pass


def setup_audit_listeners(Base) -> None:
    """Set up SQLAlchemy event listeners for auditing."""

    @event.listens_for(Base, "after_insert", propagate=True)
    def after_insert(mapper: Mapper, connection, target):
        if target.__tablename__ == "audit_logs":
            return  # Don't audit the audit log itself

        # Create audit log in a new session
        # Note: In production, use async-compatible approach
        pass

    @event.listens_for(Base, "after_update", propagate=True)
    def after_update(mapper: Mapper, connection, target):
        if target.__tablename__ == "audit_logs":
            return

        changes = get_changes(target)
        if changes:
            pass  # Create audit log

    @event.listens_for(Base, "after_delete", propagate=True)
    def after_delete(mapper: Mapper, connection, target):
        if target.__tablename__ == "audit_logs":
            return

        pass  # Create audit log
```

---

## Alembic Migration Setup

```python
# alembic/env.py
import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

from app.config import get_settings
from app.db.base import Base
from app.models import user, account, user_account, audit_log  # Import all models

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.database_url)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations in 'online' mode with async engine."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

---

## What's Preserved from NestJS Boilerplate

| Concept | Python/FastAPI Equivalent | Status |
|---------|---------------------------|--------|
| Entity model (User, Account, etc.) | SQLAlchemy models | Preserved |
| Multi-tenant via `account-id` header | FastAPI dependency | Preserved |
| Role hierarchy + permissions | Python enums + functions | Preserved |
| Super-admin bypass | Dependency check | Preserved |
| Soft deletes | Mixin with deleted_at | Preserved |
| Request context (CLS) | Python contextvars | Preserved |
| JWT auth with JWKS | python-jose + httpx | Preserved |
| OpenAPI docs | FastAPI built-in | Preserved |
| Validation | Pydantic v2 | Preserved |
| Pagination | Pydantic schemas | Preserved |
| Audit logging | SQLAlchemy events | Preserved |
| Base entity inheritance | SQLAlchemy mixins | Preserved |

---

## Key Differences from Hono Implementation

| Aspect | Hono | FastAPI |
|--------|------|---------|
| Routing | `createRoute()` + `app.openapi()` | Decorators `@router.get()` |
| Validation | Zod schemas | Pydantic models |
| Context | `c.set()` / `c.get()` | `contextvars` module |
| Dependencies | Middleware functions | `Depends()` injection |
| ORM | Drizzle | SQLAlchemy 2.0 |
| Migrations | Drizzle Kit | Alembic |
| Guards | Middleware | Dependencies with Depends() |
| OpenAPI | `@hono/zod-openapi` | Built-in FastAPI |

---

## Implementation Checklist

- [ ] Project setup with pyproject.toml
- [ ] Configuration with Pydantic Settings
- [ ] Database connection with SQLAlchemy async
- [ ] Base model classes (SoftDeleteMixin, InteractiveMixin)
- [ ] User, Account, UserAccount, AuditLog models
- [ ] Alembic migrations setup
- [ ] Request context with contextvars
- [ ] JWT validation with JWKS
- [ ] Authentication dependencies
- [ ] Role hierarchy implementation
- [ ] Permission matrix
- [ ] require_role() dependency
- [ ] require_permission() dependency
- [ ] Request context middleware
- [ ] Error handling middleware
- [ ] User service
- [ ] Account service
- [ ] User routes
- [ ] Account routes
- [ ] OpenAPI documentation
- [ ] Health check endpoint
- [ ] Database seeding script
- [ ] Tests setup with pytest-asyncio

---

## Running the Application

```bash
# Install dependencies
pip install -e ".[dev]"

# Create .env file
cp .env.example .env

# Run migrations
alembic upgrade head

# Seed database
python scripts/seed.py

# Run development server
uvicorn app.main:app --reload --port 8000

# Access docs
# http://localhost:8000/api/docs (Swagger UI)
# http://localhost:8000/api/redoc (ReDoc)
```

---

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [Pydantic v2 Documentation](https://docs.pydantic.dev/latest/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [python-jose Documentation](https://python-jose.readthedocs.io/)
- [Auth0 Python SDK](https://github.com/auth0/auth0-python)
