import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditListener } from './audit.listener';
import { AuditLog } from '../../entities/audit-log.entity';
import {
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EntityDeletedEvent,
  UserLoginEvent,
  UserLogoutEvent,
  ActorContext,
  RequestContext,
} from '../../events/domain-events';

describe('AuditListener', () => {
  let listener: AuditListener;
  let auditLogRepository: jest.Mocked<Repository<AuditLog>>;

  const mockActor: ActorContext = {
    id: 'user-123',
    email: 'user@example.com',
  };

  const mockContext: RequestContext = {
    accountId: 'account-456',
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    transactionId: 'tx-789',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditListener,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = module.get<AuditListener>(AuditListener);
    auditLogRepository = module.get(getRepositoryToken(AuditLog));
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('handleEntityCreated', () => {
    it('should create audit log with CREATE type', async () => {
      const data = { name: 'Test', value: 42 };
      const event = new EntityCreatedEvent(
        'TestEntity',
        'entity-id-1',
        data,
        mockActor,
        mockContext,
      );

      auditLogRepository.create.mockReturnValue({ id: 'audit-1' } as any);
      auditLogRepository.save.mockResolvedValue({ id: 'audit-1' } as any);

      await listener.handleEntityCreated(event);

      expect(auditLogRepository.create).toHaveBeenCalledWith({
        transactionId: 'tx-789',
        accountId: 'account-456',
        userId: 'user-123',
        entity: 'TestEntity',
        entityId: 'entity-id-1',
        transactionType: 'CREATE',
        json: data,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });
      expect(auditLogRepository.save).toHaveBeenCalled();
    });

    it('should handle events without optional context fields', async () => {
      const minimalContext: RequestContext = {
        accountId: 'account-1',
      };
      const event = new EntityCreatedEvent(
        'Entity',
        'id-1',
        {},
        mockActor,
        minimalContext,
      );

      auditLogRepository.create.mockReturnValue({} as any);
      auditLogRepository.save.mockResolvedValue({} as any);

      await listener.handleEntityCreated(event);

      expect(auditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: 'account-1',
          ipAddress: undefined,
          userAgent: undefined,
          transactionId: undefined,
        }),
      );
    });
  });

  describe('handleEntityUpdated', () => {
    it('should create audit log with UPDATE type and changes', async () => {
      const changes = {
        name: { from: 'Old', to: 'New' },
      };
      const newData = { name: 'New' };
      const event = new EntityUpdatedEvent(
        'User',
        'user-1',
        changes,
        newData,
        mockActor,
        mockContext,
      );

      auditLogRepository.create.mockReturnValue({} as any);
      auditLogRepository.save.mockResolvedValue({} as any);

      await listener.handleEntityUpdated(event);

      expect(auditLogRepository.create).toHaveBeenCalledWith({
        transactionId: 'tx-789',
        accountId: 'account-456',
        userId: 'user-123',
        entity: 'User',
        entityId: 'user-1',
        transactionType: 'UPDATE',
        json: {
          changes: changes,
          data: newData,
        },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });
    });
  });

  describe('handleEntityDeleted', () => {
    it('should create audit log with SOFT_DELETE type for soft deletes', async () => {
      const deletedData = { id: 'entity-1', name: 'Deleted' };
      const event = new EntityDeletedEvent(
        'Document',
        'doc-1',
        deletedData,
        true, // soft delete
        mockActor,
        mockContext,
      );

      auditLogRepository.create.mockReturnValue({} as any);
      auditLogRepository.save.mockResolvedValue({} as any);

      await listener.handleEntityDeleted(event);

      expect(auditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionType: 'SOFT_DELETE',
          json: deletedData,
        }),
      );
    });

    it('should create audit log with DELETE type for hard deletes', async () => {
      const event = new EntityDeletedEvent(
        'TempFile',
        'file-1',
        {},
        false, // hard delete
        mockActor,
        mockContext,
      );

      auditLogRepository.create.mockReturnValue({} as any);
      auditLogRepository.save.mockResolvedValue({} as any);

      await listener.handleEntityDeleted(event);

      expect(auditLogRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionType: 'DELETE',
        }),
      );
    });
  });

  describe('handleUserLogin', () => {
    it('should create audit log with LOGIN type', async () => {
      const event = new UserLoginEvent(
        'user-123',
        'user@example.com',
        'google',
        mockContext,
      );

      auditLogRepository.create.mockReturnValue({} as any);
      auditLogRepository.save.mockResolvedValue({} as any);

      await listener.handleUserLogin(event);

      expect(auditLogRepository.create).toHaveBeenCalledWith({
        transactionId: 'tx-789',
        accountId: 'account-456',
        userId: 'user-123',
        entity: 'User',
        entityId: 'user-123',
        transactionType: 'LOGIN',
        json: {
          email: 'user@example.com',
          provider: 'google',
        },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });
    });

    it('should record different auth providers', async () => {
      const providers = ['google', 'auth0', 'github'];

      for (const provider of providers) {
        const event = new UserLoginEvent('user-1', 'email@test.com', provider, mockContext);

        auditLogRepository.create.mockReturnValue({} as any);
        auditLogRepository.save.mockResolvedValue({} as any);

        await listener.handleUserLogin(event);

        expect(auditLogRepository.create).toHaveBeenLastCalledWith(
          expect.objectContaining({
            json: expect.objectContaining({ provider }),
          }),
        );
      }
    });
  });

  describe('handleUserLogout', () => {
    it('should create audit log with LOGOUT type', async () => {
      const event = new UserLogoutEvent('user-123', mockContext);

      auditLogRepository.create.mockReturnValue({} as any);
      auditLogRepository.save.mockResolvedValue({} as any);

      await listener.handleUserLogout(event);

      expect(auditLogRepository.create).toHaveBeenCalledWith({
        transactionId: 'tx-789',
        accountId: 'account-456',
        userId: 'user-123',
        entity: 'User',
        entityId: 'user-123',
        transactionType: 'LOGOUT',
        json: null,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });
    });
  });

  describe('error handling', () => {
    it('should not throw when audit log creation fails', async () => {
      const event = new EntityCreatedEvent(
        'Entity',
        'id',
        {},
        mockActor,
        mockContext,
      );

      auditLogRepository.create.mockReturnValue({} as any);
      auditLogRepository.save.mockRejectedValue(new Error('Database error'));

      // Should not throw
      await expect(listener.handleEntityCreated(event)).resolves.not.toThrow();
    });

    it('should log error when audit log creation fails', async () => {
      const loggerSpy = jest.spyOn(listener['logger'], 'error');
      const event = new EntityCreatedEvent(
        'Entity',
        'id',
        {},
        mockActor,
        mockContext,
      );

      auditLogRepository.create.mockReturnValue({} as any);
      auditLogRepository.save.mockRejectedValue(new Error('Database error'));

      await listener.handleEntityCreated(event);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Failed to create audit log',
        expect.any(Error),
      );
    });
  });
});
