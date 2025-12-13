import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../entities/audit-log.entity';
import {
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EntityDeletedEvent,
  UserLoginEvent,
  UserLogoutEvent,
} from '../../events/domain-events';

/**
 * Event-driven audit listener.
 * Listens to domain events and creates audit log entries.
 *
 * This provides an alternative to TypeORM subscribers with:
 * - Explicit event emission in services
 * - Richer context (actor, IP, changes)
 * - Easier testing and debugging
 */
@Injectable()
export class AuditListener {
  private readonly logger = new Logger(AuditListener.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  @OnEvent(EntityCreatedEvent.eventName)
  async handleEntityCreated(event: EntityCreatedEvent): Promise<void> {
    await this.createAuditLog({
      transactionId: event.context.transactionId,
      accountId: event.context.accountId,
      userId: event.actor.id,
      entity: event.entity,
      entityId: event.entityId,
      transactionType: 'CREATE',
      json: event.data,
      ipAddress: event.context.ip,
      userAgent: event.context.userAgent,
    });

    this.logger.debug(
      `Audit: ${event.actor.email} created ${event.entity}:${event.entityId}`,
    );
  }

  @OnEvent(EntityUpdatedEvent.eventName)
  async handleEntityUpdated(event: EntityUpdatedEvent): Promise<void> {
    await this.createAuditLog({
      transactionId: event.context.transactionId,
      accountId: event.context.accountId,
      userId: event.actor.id,
      entity: event.entity,
      entityId: event.entityId,
      transactionType: 'UPDATE',
      json: {
        changes: event.changes,
        data: event.newData,
      },
      ipAddress: event.context.ip,
      userAgent: event.context.userAgent,
    });

    this.logger.debug(
      `Audit: ${event.actor.email} updated ${event.entity}:${event.entityId}`,
    );
  }

  @OnEvent(EntityDeletedEvent.eventName)
  async handleEntityDeleted(event: EntityDeletedEvent): Promise<void> {
    await this.createAuditLog({
      transactionId: event.context.transactionId,
      accountId: event.context.accountId,
      userId: event.actor.id,
      entity: event.entity,
      entityId: event.entityId,
      transactionType: event.softDelete ? 'SOFT_DELETE' : 'DELETE',
      json: event.deletedData,
      ipAddress: event.context.ip,
      userAgent: event.context.userAgent,
    });

    this.logger.debug(
      `Audit: ${event.actor.email} deleted ${event.entity}:${event.entityId}`,
    );
  }

  @OnEvent(UserLoginEvent.eventName)
  async handleUserLogin(event: UserLoginEvent): Promise<void> {
    await this.createAuditLog({
      transactionId: event.context.transactionId,
      accountId: event.context.accountId,
      userId: event.userId,
      entity: 'User',
      entityId: event.userId,
      transactionType: 'LOGIN',
      json: {
        email: event.email,
        provider: event.provider,
      },
      ipAddress: event.context.ip,
      userAgent: event.context.userAgent,
    });

    this.logger.debug(`Audit: User ${event.email} logged in via ${event.provider}`);
  }

  @OnEvent(UserLogoutEvent.eventName)
  async handleUserLogout(event: UserLogoutEvent): Promise<void> {
    await this.createAuditLog({
      transactionId: event.context.transactionId,
      accountId: event.context.accountId,
      userId: event.userId,
      entity: 'User',
      entityId: event.userId,
      transactionType: 'LOGOUT',
      json: null,
      ipAddress: event.context.ip,
      userAgent: event.context.userAgent,
    });

    this.logger.debug(`Audit: User ${event.userId} logged out`);
  }

  private async createAuditLog(data: Record<string, any>): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create(data);
      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
      // Don't throw - audit failures shouldn't break the main operation
    }
  }
}
