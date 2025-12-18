import { ClsService } from 'nestjs-cls';
import { User } from '../../entities/user.entity';

/**
 * RequestContext provides explicit access to request-scoped data.
 *
 * This pattern offers an alternative to implicit CLS access, making dependencies
 * more visible in function signatures. Services can accept RequestContext as an
 * optional parameter, falling back to CLS when not provided.
 *
 * Benefits:
 * - Makes dependencies explicit and visible in function signatures
 * - Easier to test (can pass context directly instead of mocking CLS)
 * - Clear documentation of what request data a function needs
 * - Backwards compatible with existing CLS-based code
 *
 * Usage in services:
 * ```typescript
 * async create(dto: CreateDto, context?: RequestContext) {
 *   const ctx = context ?? RequestContext.fromCls(this.cls);
 *   // Use ctx.accountId, ctx.user, etc.
 * }
 * ```
 *
 * Usage in tests:
 * ```typescript
 * const context = new RequestContext({
 *   accountId: 'test-account',
 *   user: createTestUser(),
 * });
 * await service.create(dto, context);
 * ```
 */
export class RequestContext {
  readonly accountId: string;
  readonly user: User;
  readonly transactionId: string;
  readonly ip: string;
  readonly userAgent: string;

  constructor(params: {
    accountId: string;
    user: User;
    transactionId?: string;
    ip?: string;
    userAgent?: string;
  }) {
    this.accountId = params.accountId;
    this.user = params.user;
    this.transactionId = params.transactionId ?? '';
    this.ip = params.ip ?? '';
    this.userAgent = params.userAgent ?? '';
  }

  /**
   * Create RequestContext from CLS (Continuation Local Storage).
   * Use this when context is not explicitly provided.
   */
  static fromCls(cls: ClsService): RequestContext {
    const accountId = cls.get<string>('accountId');
    const user = cls.get<User>('user');
    const transactionId = cls.get<string>('transactionId');
    const ip = cls.get<string>('ip');
    const userAgent = cls.get<string>('userAgent');

    if (!accountId) {
      throw new Error('RequestContext: accountId not found in CLS');
    }
    if (!user) {
      throw new Error('RequestContext: user not found in CLS');
    }

    return new RequestContext({
      accountId,
      user,
      transactionId,
      ip,
      userAgent,
    });
  }

  /**
   * Try to create RequestContext from CLS, returning null if not available.
   * Useful for optional context scenarios.
   */
  static tryFromCls(cls: ClsService): RequestContext | null {
    try {
      return RequestContext.fromCls(cls);
    } catch {
      return null;
    }
  }

  /**
   * Check if the current user is a super admin.
   */
  get isSuperAdmin(): boolean {
    return this.user?.isSuperAdmin ?? false;
  }

  /**
   * Get the current user's ID.
   */
  get userId(): string {
    return this.user?.id;
  }

  /**
   * Get the current user's email.
   */
  get userEmail(): string | null {
    return this.user?.email ?? null;
  }

  /**
   * Create a copy of this context with updated values.
   */
  with(updates: Partial<{
    accountId: string;
    user: User;
    transactionId: string;
    ip: string;
    userAgent: string;
  }>): RequestContext {
    return new RequestContext({
      accountId: updates.accountId ?? this.accountId,
      user: updates.user ?? this.user,
      transactionId: updates.transactionId ?? this.transactionId,
      ip: updates.ip ?? this.ip,
      userAgent: updates.userAgent ?? this.userAgent,
    });
  }

  /**
   * Convert to a plain object for logging or serialization.
   */
  toJSON(): Record<string, unknown> {
    return {
      accountId: this.accountId,
      userId: this.userId,
      userEmail: this.userEmail,
      transactionId: this.transactionId,
      ip: this.ip,
      userAgent: this.userAgent,
    };
  }
}
