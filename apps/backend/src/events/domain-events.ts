/**
 * Domain events for audit logging and cross-cutting concerns.
 * These events are emitted from services and handled by listeners.
 *
 * Using events instead of TypeORM subscribers provides:
 * - Explicit dependencies (visible in service constructor)
 * - Easier testing (mock event emitter)
 * - More control over what gets audited
 * - Richer context (actor, IP, user agent included)
 */

export interface ActorContext {
  id: string;
  email: string;
}

export interface RequestContext {
  accountId: string;
  ip?: string;
  userAgent?: string;
  transactionId?: string;
}

/**
 * Base class for all domain events
 */
export abstract class BaseDomainEvent {
  readonly occurredAt: Date;

  constructor(
    public readonly entity: string,
    public readonly entityId: string,
    public readonly actor: ActorContext,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }
}

/**
 * Emitted when an entity is created
 */
export class EntityCreatedEvent extends BaseDomainEvent {
  static readonly eventName = 'entity.created';

  constructor(
    entity: string,
    entityId: string,
    public readonly data: Record<string, any>,
    actor: ActorContext,
    context: RequestContext,
  ) {
    super(entity, entityId, actor, context);
  }
}

/**
 * Emitted when an entity is updated
 */
export class EntityUpdatedEvent extends BaseDomainEvent {
  static readonly eventName = 'entity.updated';

  constructor(
    entity: string,
    entityId: string,
    public readonly changes: Record<string, { from: any; to: any }>,
    public readonly newData: Record<string, any>,
    actor: ActorContext,
    context: RequestContext,
  ) {
    super(entity, entityId, actor, context);
  }
}

/**
 * Emitted when an entity is deleted (soft or hard)
 */
export class EntityDeletedEvent extends BaseDomainEvent {
  static readonly eventName = 'entity.deleted';

  constructor(
    entity: string,
    entityId: string,
    public readonly deletedData: Record<string, any>,
    public readonly softDelete: boolean,
    actor: ActorContext,
    context: RequestContext,
  ) {
    super(entity, entityId, actor, context);
  }
}

/**
 * Emitted on user login
 */
export class UserLoginEvent {
  static readonly eventName = 'user.login';
  readonly occurredAt: Date;

  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly provider: string,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }
}

/**
 * Emitted on user logout
 */
export class UserLogoutEvent {
  static readonly eventName = 'user.logout';
  readonly occurredAt: Date;

  constructor(
    public readonly userId: string,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }
}
