import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { UserAccount } from '../../entities/user-accounts.entity';
import { UserProvider } from '../../entities/user-provider.entity';
import { Auth0Provider } from './providers/auth0.provider';
import { AccountsService } from '../accounts/accounts.service';

describe('UsersService - Provider Methods', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;
  let userProviderRepository: jest.Mocked<Repository<UserProvider>>;

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    status: 'accepted',
    providerIds: [],
    isSuperAdmin: false,
    profileImage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    userAccounts: [],
    providers: [],
    addProvider: jest.fn(),
  } as any;

  const createMockQueryBuilder = () => {
    const qb: Partial<SelectQueryBuilder<User>> = {
      innerJoin: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };
    return qb as jest.Mocked<SelectQueryBuilder<User>>;
  };

  beforeEach(async () => {
    const mockQueryBuilder = createMockQueryBuilder();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            findAndCount: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(UserAccount),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserProvider),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: ClsService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: Auth0Provider,
          useValue: {
            getUserByEmail: jest.fn(),
            sendInvitation: jest.fn(),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    userProviderRepository = module.get(getRepositoryToken(UserProvider));
  });

  describe('findByProviderId', () => {
    it('should find user by single provider ID', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.findByProviderId('google|123456');

      expect(result).toEqual(mockUser);
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
        'user_providers',
        'provider',
        'provider.user_id = user.id',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '((provider.provider_name = :providerName0 AND provider.provider_user_id = :providerUserId0))',
        {
          providerName0: 'google',
          providerUserId0: '123456',
        },
      );
    });

    it('should find user by array of provider IDs', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.findByProviderId([
        'google|123456',
        'auth0|user_abc',
      ]);

      expect(result).toEqual(mockUser);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '((provider.provider_name = :providerName0 AND provider.provider_user_id = :providerUserId0) OR (provider.provider_name = :providerName1 AND provider.provider_user_id = :providerUserId1))',
        {
          providerName0: 'google',
          providerUserId0: '123456',
          providerName1: 'auth0',
          providerUserId1: 'user_abc',
        },
      );
    });

    it('should return null when user not found', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(null);
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.findByProviderId('google|nonexistent');

      expect(result).toBeNull();
    });

    it('should handle legacy provider IDs without separator', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      await service.findByProviderId('legacy_user_id');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '((provider.provider_name = :providerName0 AND provider.provider_user_id = :providerUserId0))',
        {
          providerName0: 'unknown',
          providerUserId0: 'legacy_user_id',
        },
      );
    });

    it('should join with userAccounts relation', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);
      (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      await service.findByProviderId('google|123456');

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'user.userAccounts',
        'userAccount',
      );
    });
  });

  describe('addProviderToUser', () => {
    it('should add provider to user by User entity', async () => {
      const createdProvider = {
        id: 'provider-uuid',
        userId: mockUser.id,
        providerName: 'google',
        providerUserId: '123456',
        createdAt: new Date(),
      };

      userProviderRepository.create.mockReturnValue(createdProvider as any);
      userProviderRepository.save.mockResolvedValue(createdProvider as any);

      const result = await service.addProviderToUser(mockUser, 'google|123456');

      expect(userProviderRepository.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        providerName: 'google',
        providerUserId: '123456',
      });
      expect(userProviderRepository.save).toHaveBeenCalledWith(createdProvider);
      expect(result).toEqual(createdProvider);
    });

    it('should add provider to user by user ID string', async () => {
      const createdProvider = {
        id: 'provider-uuid',
        userId: 'user-456',
        providerName: 'auth0',
        providerUserId: 'user_abc',
        createdAt: new Date(),
      };

      userProviderRepository.create.mockReturnValue(createdProvider as any);
      userProviderRepository.save.mockResolvedValue(createdProvider as any);

      const result = await service.addProviderToUser('user-456', 'auth0|user_abc');

      expect(userProviderRepository.create).toHaveBeenCalledWith({
        userId: 'user-456',
        providerName: 'auth0',
        providerUserId: 'user_abc',
      });
      expect(result).toEqual(createdProvider);
    });

    it('should handle provider ID with google-oauth2 format', async () => {
      const createdProvider = {
        id: 'provider-uuid',
        userId: mockUser.id,
        providerName: 'google-oauth2',
        providerUserId: '12345.apps.googleusercontent.com',
        createdAt: new Date(),
      };

      userProviderRepository.create.mockReturnValue(createdProvider as any);
      userProviderRepository.save.mockResolvedValue(createdProvider as any);

      await service.addProviderToUser(
        mockUser,
        'google-oauth2|12345.apps.googleusercontent.com',
      );

      expect(userProviderRepository.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        providerName: 'google-oauth2',
        providerUserId: '12345.apps.googleusercontent.com',
      });
    });
  });

  describe('removeProviderFromUser', () => {
    it('should remove provider from user by User entity', async () => {
      userProviderRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.removeProviderFromUser(mockUser, 'google|123456');

      expect(userProviderRepository.delete).toHaveBeenCalledWith({
        userId: mockUser.id,
        providerName: 'google',
        providerUserId: '123456',
      });
    });

    it('should remove provider from user by user ID string', async () => {
      userProviderRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.removeProviderFromUser('user-456', 'auth0|user_abc');

      expect(userProviderRepository.delete).toHaveBeenCalledWith({
        userId: 'user-456',
        providerName: 'auth0',
        providerUserId: 'user_abc',
      });
    });

    it('should handle non-existent provider gracefully', async () => {
      userProviderRepository.delete.mockResolvedValue({ affected: 0 } as any);

      // Should not throw
      await expect(
        service.removeProviderFromUser(mockUser, 'nonexistent|provider'),
      ).resolves.not.toThrow();

      expect(userProviderRepository.delete).toHaveBeenCalled();
    });

    it('should parse complex provider IDs correctly', async () => {
      userProviderRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.removeProviderFromUser(
        mockUser,
        'google-oauth2|id|with|pipes',
      );

      expect(userProviderRepository.delete).toHaveBeenCalledWith({
        userId: mockUser.id,
        providerName: 'google-oauth2',
        providerUserId: 'id|with|pipes',
      });
    });
  });
});
