import {
  BaseDomainEvent,
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EntityDeletedEvent,
  UserLoginEvent,
  UserLogoutEvent,
  ActorContext,
  RequestContext,
} from './domain-events';

describe('Domain Events', () => {
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

  describe('EntityCreatedEvent', () => {
    it('should have correct event name', () => {
      expect(EntityCreatedEvent.eventName).toBe('entity.created');
    });

    it('should set all properties correctly', () => {
      const data = { name: 'Test Entity', value: 42 };

      const event = new EntityCreatedEvent(
        'TestEntity',
        'entity-id-1',
        data,
        mockActor,
        mockContext,
      );

      expect(event.entity).toBe('TestEntity');
      expect(event.entityId).toBe('entity-id-1');
      expect(event.data).toEqual(data);
      expect(event.actor).toEqual(mockActor);
      expect(event.context).toEqual(mockContext);
    });

    it('should set occurredAt to current time', () => {
      const before = new Date();
      const event = new EntityCreatedEvent(
        'TestEntity',
        'id',
        {},
        mockActor,
        mockContext,
      );
      const after = new Date();

      expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('EntityUpdatedEvent', () => {
    it('should have correct event name', () => {
      expect(EntityUpdatedEvent.eventName).toBe('entity.updated');
    });

    it('should set all properties correctly', () => {
      const changes = {
        name: { from: 'Old Name', to: 'New Name' },
        status: { from: 'draft', to: 'published' },
      };
      const newData = { name: 'New Name', status: 'published' };

      const event = new EntityUpdatedEvent(
        'Post',
        'post-123',
        changes,
        newData,
        mockActor,
        mockContext,
      );

      expect(event.entity).toBe('Post');
      expect(event.entityId).toBe('post-123');
      expect(event.changes).toEqual(changes);
      expect(event.newData).toEqual(newData);
      expect(event.actor).toEqual(mockActor);
      expect(event.context).toEqual(mockContext);
    });

    it('should capture complex change objects', () => {
      const changes = {
        metadata: {
          from: { tags: ['old'] },
          to: { tags: ['new', 'updated'] },
        },
      };

      const event = new EntityUpdatedEvent(
        'Document',
        'doc-1',
        changes,
        {},
        mockActor,
        mockContext,
      );

      expect(event.changes.metadata.from).toEqual({ tags: ['old'] });
      expect(event.changes.metadata.to).toEqual({ tags: ['new', 'updated'] });
    });
  });

  describe('EntityDeletedEvent', () => {
    it('should have correct event name', () => {
      expect(EntityDeletedEvent.eventName).toBe('entity.deleted');
    });

    it('should set all properties for soft delete', () => {
      const deletedData = { id: 'user-1', name: 'Deleted User' };

      const event = new EntityDeletedEvent(
        'User',
        'user-1',
        deletedData,
        true, // soft delete
        mockActor,
        mockContext,
      );

      expect(event.entity).toBe('User');
      expect(event.entityId).toBe('user-1');
      expect(event.deletedData).toEqual(deletedData);
      expect(event.softDelete).toBe(true);
    });

    it('should set softDelete to false for hard delete', () => {
      const event = new EntityDeletedEvent(
        'TempFile',
        'file-1',
        {},
        false, // hard delete
        mockActor,
        mockContext,
      );

      expect(event.softDelete).toBe(false);
    });
  });

  describe('UserLoginEvent', () => {
    it('should have correct event name', () => {
      expect(UserLoginEvent.eventName).toBe('user.login');
    });

    it('should set all properties correctly', () => {
      const event = new UserLoginEvent(
        'user-123',
        'user@example.com',
        'google',
        mockContext,
      );

      expect(event.userId).toBe('user-123');
      expect(event.email).toBe('user@example.com');
      expect(event.provider).toBe('google');
      expect(event.context).toEqual(mockContext);
    });

    it('should set occurredAt to current time', () => {
      const before = new Date();
      const event = new UserLoginEvent('id', 'email', 'provider', mockContext);
      const after = new Date();

      expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should handle different provider types', () => {
      const providers = ['google', 'auth0', 'github', 'email'];

      providers.forEach((provider) => {
        const event = new UserLoginEvent('user-1', 'test@test.com', provider, mockContext);
        expect(event.provider).toBe(provider);
      });
    });
  });

  describe('UserLogoutEvent', () => {
    it('should have correct event name', () => {
      expect(UserLogoutEvent.eventName).toBe('user.logout');
    });

    it('should set all properties correctly', () => {
      const event = new UserLogoutEvent('user-123', mockContext);

      expect(event.userId).toBe('user-123');
      expect(event.context).toEqual(mockContext);
    });

    it('should set occurredAt to current time', () => {
      const before = new Date();
      const event = new UserLogoutEvent('user-id', mockContext);
      const after = new Date();

      expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('RequestContext', () => {
    it('should allow minimal context with only accountId', () => {
      const minimalContext: RequestContext = {
        accountId: 'account-1',
      };

      const event = new EntityCreatedEvent(
        'Entity',
        'id',
        {},
        mockActor,
        minimalContext,
      );

      expect(event.context.accountId).toBe('account-1');
      expect(event.context.ip).toBeUndefined();
      expect(event.context.userAgent).toBeUndefined();
      expect(event.context.transactionId).toBeUndefined();
    });

    it('should allow full context with all fields', () => {
      const fullContext: RequestContext = {
        accountId: 'account-1',
        ip: '10.0.0.1',
        userAgent: 'TestAgent/1.0',
        transactionId: 'tx-abc-123',
      };

      const event = new EntityCreatedEvent('Entity', 'id', {}, mockActor, fullContext);

      expect(event.context).toEqual(fullContext);
    });
  });

  describe('ActorContext', () => {
    it('should contain id and email', () => {
      const actor: ActorContext = {
        id: 'actor-id',
        email: 'actor@example.com',
      };

      const event = new EntityCreatedEvent('Entity', 'id', {}, actor, mockContext);

      expect(event.actor.id).toBe('actor-id');
      expect(event.actor.email).toBe('actor@example.com');
    });
  });
});
