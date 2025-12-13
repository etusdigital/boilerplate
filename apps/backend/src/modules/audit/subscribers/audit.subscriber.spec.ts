import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { DataSource, EntityManager, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { AuditSubscriber } from './audit.subscriber';
import { AuditLog } from '../../../entities/audit-log.entity';

describe('AuditSubscriber', () => {
  let subscriber: AuditSubscriber;
  let mockClsService: jest.Mocked<ClsService>;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockEntityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    mockEntityManager = {
      save: jest.fn(),
    } as any;

    mockClsService = {
      get: jest.fn(),
    } as any;

    mockDataSource = {
      subscribers: [],
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuditSubscriber,
          useFactory: () => new AuditSubscriber(mockClsService, mockDataSource),
        },
        { provide: ClsService, useValue: mockClsService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    subscriber = module.get<AuditSubscriber>(AuditSubscriber);
  });

  it('should be defined', () => {
    expect(subscriber).toBeDefined();
  });

  it('should register itself with DataSource subscribers', () => {
    expect(mockDataSource.subscribers).toContain(subscriber);
  });

  describe('afterInsert', () => {
    it('should create audit log for entity insert', async () => {
      mockClsService.get.mockImplementation((key: string) => {
        const values: Record<string, any> = {
          transactionId: 'tx-123',
          accountId: 'account-456',
          user: { id: 'user-789', email: 'user@test.com' },
          ip: '192.168.1.1',
          userAgent: 'TestAgent',
        };
        return values[key];
      });

      const event: InsertEvent<any> = {
        metadata: { name: 'User' },
        entity: { id: 'entity-1', name: 'Test User' },
        manager: mockEntityManager,
      } as any;

      await subscriber.afterInsert(event);

      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionId: 'tx-123',
          accountId: 'account-456',
          userId: 'user-789',
          entity: 'User',
          entityId: 'entity-1',
          transactionType: 'CREATE',
        }),
      );
    });

    it('should skip audit for AuditLog entity', async () => {
      const event: InsertEvent<any> = {
        metadata: { name: 'AuditLog' },
        entity: { id: 'audit-1' },
        manager: mockEntityManager,
      } as any;

      await subscriber.afterInsert(event);

      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });

    it('should skip audit when entity is null', async () => {
      const event: InsertEvent<any> = {
        metadata: { name: 'User' },
        entity: null,
        manager: mockEntityManager,
      } as any;

      await subscriber.afterInsert(event);

      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });
  });

  describe('afterUpdate', () => {
    it('should create audit log for entity update', async () => {
      mockClsService.get.mockImplementation((key: string) => {
        const values: Record<string, any> = {
          transactionId: 'tx-456',
          accountId: 'account-789',
          user: { id: 'user-123' },
          ip: '10.0.0.1',
          userAgent: 'Chrome',
        };
        return values[key];
      });

      const event: UpdateEvent<any> = {
        metadata: { name: 'Post' },
        entity: { id: 'post-1', title: 'Updated Title' },
        manager: mockEntityManager,
      } as any;

      await subscriber.afterUpdate(event);

      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionType: 'UPDATE',
          entity: 'Post',
          entityId: 'post-1',
        }),
      );
    });

    it('should skip audit for AuditLog entity', async () => {
      const event: UpdateEvent<any> = {
        metadata: { name: 'AuditLog' },
        entity: { id: 'audit-1' },
        manager: mockEntityManager,
      } as any;

      await subscriber.afterUpdate(event);

      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });

    it('should skip audit when entity is null', async () => {
      const event: UpdateEvent<any> = {
        metadata: { name: 'Post' },
        entity: null,
        manager: mockEntityManager,
      } as any;

      await subscriber.afterUpdate(event);

      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });
  });

  describe('afterRemove', () => {
    it('should create audit log for entity delete', async () => {
      mockClsService.get.mockImplementation((key: string) => {
        const values: Record<string, any> = {
          transactionId: 'tx-delete',
          accountId: 'account-delete',
          user: { id: 'user-delete' },
          ip: '127.0.0.1',
          userAgent: 'Firefox',
        };
        return values[key];
      });

      const event: RemoveEvent<any> = {
        metadata: { name: 'Comment' },
        entity: { id: 'comment-1', content: 'Deleted comment' },
        manager: mockEntityManager,
      } as any;

      await subscriber.afterRemove(event);

      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionType: 'DELETE',
          entity: 'Comment',
          entityId: 'comment-1',
        }),
      );
    });

    it('should skip audit for AuditLog entity', async () => {
      const event: RemoveEvent<any> = {
        metadata: { name: 'AuditLog' },
        entity: { id: 'audit-1' },
        manager: mockEntityManager,
      } as any;

      await subscriber.afterRemove(event);

      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });

    it('should skip audit when entity is null', async () => {
      const event: RemoveEvent<any> = {
        metadata: { name: 'Comment' },
        entity: null,
        manager: mockEntityManager,
      } as any;

      await subscriber.afterRemove(event);

      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });
  });

  describe('CLS context integration', () => {
    it('should handle missing user in CLS context', async () => {
      mockClsService.get.mockImplementation((key: string) => {
        if (key === 'user') return undefined;
        return 'value';
      });

      const event: InsertEvent<any> = {
        metadata: { name: 'User' },
        entity: { id: 'entity-1' },
        manager: mockEntityManager,
      } as any;

      await subscriber.afterInsert(event);

      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: undefined,
        }),
      );
    });

    it('should handle missing optional CLS values', async () => {
      mockClsService.get.mockImplementation((key: string) => {
        const values: Record<string, any> = {
          accountId: 'account-1',
          user: { id: 'user-1' },
          // ip and userAgent are missing
        };
        return values[key];
      });

      const event: InsertEvent<any> = {
        metadata: { name: 'Document' },
        entity: { id: 'doc-1' },
        manager: mockEntityManager,
      } as any;

      await subscriber.afterInsert(event);

      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: undefined,
          userAgent: undefined,
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should throw error when save fails', async () => {
      mockClsService.get.mockReturnValue('value');
      mockEntityManager.save.mockRejectedValue(new Error('Database error'));

      const event: InsertEvent<any> = {
        metadata: { name: 'User' },
        entity: { id: 'entity-1' },
        manager: mockEntityManager,
      } as any;

      await expect(subscriber.afterInsert(event)).rejects.toThrow('Database error');
    });
  });
});
