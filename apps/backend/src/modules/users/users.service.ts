import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { UserAccount } from '../../entities/user-accounts.entity';
import { User } from '../../entities/user.entity';
import { UserProvider } from '../../entities/user-provider.entity';
import { Repository, In } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserAccountDto } from './dto/user-account.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Provider } from './providers/auth0.provider';
import { AccountsService } from '../accounts/accounts.service';
import { Role } from 'src/auth/enums/roles.enum';
import { v7 as uuidv7 } from 'uuid';
import { PaginationQueryDto, createPaginationMeta } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    @InjectRepository(UserProvider)
    private readonly userProviderRepository: Repository<UserProvider>,
    private readonly cls: ClsService,
    private readonly auth0Provider: Auth0Provider,
    private readonly accountsService: AccountsService,
  ) {}

  async find() {
    return await this.userRepository.find();
  }

  async findWithPagination(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ data: User[]; meta: any }> {
    const user = this.cls.get<User>('user');
    const {
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = paginationQuery;
    const skip = (page - 1) * limit;

    // Validate sortBy field to prevent SQL injection
    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'name',
      'email',
      'status',
    ] as const;

    type AllowedSortField = (typeof allowedSortFields)[number];

    const isValidSortField = (field: string): field is AllowedSortField => {
      return allowedSortFields.includes(field as AllowedSortField);
    };

    const isValidSortOrder = (order: string): order is 'ASC' | 'DESC' => {
      return order === 'ASC' || order === 'DESC';
    };

    const validSortBy: AllowedSortField = isValidSortField(sortBy)
      ? sortBy
      : 'createdAt';
    const validSortOrder: 'ASC' | 'DESC' = isValidSortOrder(sortOrder)
      ? sortOrder
      : 'DESC';

    if (user?.isSuperAdmin) {
      const [users, totalItems] = await this.userRepository.findAndCount({
        skip,
        take: limit,
        order: { [validSortBy]: validSortOrder },
        relations: ['userAccounts'],
      });

      const meta = createPaginationMeta(totalItems, page, limit);

      return {
        data: users,
        meta,
      };
    }

    // For non-super admin users, only show users from their accounts
    const userAccounts = await this.userAccountRepository.find({
      where: { userId: user.id },
      relations: ['account'],
    });

    const accountIds = userAccounts.map((ua) => ua.accountId);

    const [users, totalItems] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userAccounts', 'userAccount')
      .leftJoinAndSelect('userAccount.account', 'account')
      .where('userAccount.accountId IN (:...accountIds)', { accountIds })
      .skip(skip)
      .take(limit)
      .orderBy(`user.${validSortBy}`, validSortOrder)
      .getManyAndCount();

    const meta = createPaginationMeta(totalItems, page, limit);

    return {
      data: users,
      meta,
    };
  }

  async findById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * Find a user by their identity provider ID.
   * Uses a database-agnostic JOIN query through the user_providers table.
   *
   * @param providerId - Provider ID in format "provider|userId" (e.g., "google|123456")
   */
  async findByProviderId(providerId: string | string[]): Promise<User | null> {
    const providerIds = Array.isArray(providerId) ? providerId : [providerId];

    // Parse provider IDs into name/userId pairs for the JOIN query
    const parsed = providerIds.map((id) => UserProvider.parseProviderId(id));

    // Build query using standard JOIN - works on any database
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user_providers', 'provider', 'provider.user_id = user.id')
      .leftJoinAndSelect('user.userAccounts', 'userAccount');

    // Build OR conditions for each provider ID
    const conditions = parsed.map((_, index) => {
      return `(provider.provider_name = :providerName${index} AND provider.provider_user_id = :providerUserId${index})`;
    });

    const parameters = parsed.reduce(
      (acc, { providerName, providerUserId }, index) => {
        acc[`providerName${index}`] = providerName;
        acc[`providerUserId${index}`] = providerUserId;
        return acc;
      },
      {} as Record<string, string>,
    );

    queryBuilder.where(`(${conditions.join(' OR ')})`, parameters);

    return await queryBuilder.getOne();
  }

  /**
   * Add a provider to a user.
   * Creates a record in the user_providers join table.
   *
   * @param user - User entity or user ID
   * @param providerId - Provider ID in format "provider|userId"
   */
  async addProviderToUser(
    userOrId: User | string,
    providerId: string,
  ): Promise<UserProvider> {
    const userId = typeof userOrId === 'string' ? userOrId : userOrId.id;
    const { providerName, providerUserId } =
      UserProvider.parseProviderId(providerId);

    const provider = this.userProviderRepository.create({
      userId,
      providerName,
      providerUserId,
    });

    return await this.userProviderRepository.save(provider);
  }

  /**
   * Remove a provider from a user.
   */
  async removeProviderFromUser(
    userOrId: User | string,
    providerId: string,
  ): Promise<void> {
    const userId = typeof userOrId === 'string' ? userOrId : userOrId.id;
    const { providerName, providerUserId } =
      UserProvider.parseProviderId(providerId);

    await this.userProviderRepository.delete({
      userId,
      providerName,
      providerUserId,
    });
  }

  async create(user: UserDto) {
    const currentUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (currentUser && currentUser.status === 'accepted') {
      throw new BadRequestException('User already exists');
    }

    let existingUsers = await this.auth0Provider.getUserByEmail(user.email);
    if (existingUsers.length === 0) {
      const { user: auth0User } = await this.auth0Provider.sendInvitation(
        user.email,
        user.name,
      );
      existingUsers = [auth0User];
    }

    const auth0User =
      existingUsers.find((user) => user.user_id.includes('google-oauth2')) ||
      existingUsers[0];

    const newUser = this.userRepository.create({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || auth0User.picture,
      providerIds: [auth0User.user_id],
      status: 'invited',
      isSuperAdmin: user.isSuperAdmin || false,
    });

    const savedUser = await this.userRepository.save(newUser);

    if (user.userAccounts?.length) {
      const userAccounts = user.userAccounts.map((account) => ({
        ...account,
        userId: savedUser.id,
      }));
      await this.createUserAccounts(userAccounts);
    }

    return savedUser;
  }

  async update(id: string, user: UserDto) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id },
    });

    if (userToUpdate) {
      const receivedAccounts = [...(user.userAccounts || [])];

      user.userAccounts = userToUpdate.userAccounts || [];
      const uaAdd: UserAccountDto[] = [];
      const uaDel: UserAccountDto[] = [];

      receivedAccounts.forEach((account) => {
        if (
          !user.userAccounts?.some((a) => a.accountId === account.accountId)
        ) {
          uaAdd.push({
            ...account,
            userId: id,
          });
        }

        if (
          user.userAccounts?.some(
            (a) => a.accountId === account.accountId && a.role !== account.role,
          )
        ) {
          const matched = user.userAccounts?.find(
            (a) => a.accountId === account.accountId,
          );
          uaAdd.push({
            ...matched,
            role: account.role,
          } as UserAccountDto);
        }
      });

      user.userAccounts.forEach((account) => {
        if (!receivedAccounts.some((a) => a.accountId === account.accountId)) {
          uaDel.push({
            accountId: account.accountId,
            userId: id,
            role: account.role,
          } as UserAccountDto);
        }
      });

      delete user.userAccounts;

      await this.userRepository.update(id, { ...user, id } as User);

      await this.createUserAccounts(uaAdd);

      await this.deleteUserAccounts(uaDel);

      return await this.userRepository.findOne({
        where: { id },
      });
    }
  }

  async delete(id: string) {
    return await this.userRepository.softDelete(id);
  }

  async login(
    userLogin: LoginDto,
    jwtUser: { userId: string; [key: string]: any },
  ) {
    // Set these manually since this route is excluded from the middleware that does it.
    this.cls.set('transactionId', uuidv7());

    const user = await this.userRepository.findOne({
      where: { email: userLogin.email },
      relations: ['userAccounts'],
    });
    if (!user) throw new ForbiddenException();

    this.cls.set('user', { ...user, userAccounts: null });
    if (user.userAccounts?.length) {
      this.cls.set('accountId', user.userAccounts[0].accountId);
    }

    if (user.isSuperAdmin) {
      const accounts = await this.accountsService.findAll(user);
      this.cls.set('accountId', accounts[0].id);
    }

    if (user.status !== 'accepted') {
      user.status = 'accepted';
      user.addProvider(jwtUser.userId);
      await this.userRepository.save(user);
    }

    /**
     * If user is super admin, we need to get all accounts for the user manually.
     */

    if (user?.isSuperAdmin) {
      const accounts = await this.accountsService.findAll(user);
      user.userAccounts = accounts.map(
        (account) =>
          ({
            id: 0,
            accountId: account.id,
            userId: user.id,
            role: Role.ADMIN,
            account: account,
          }) as UserAccount,
      );
    }

    return user;
  }

  async createUserAccounts(userAccounts: UserAccountDto[]) {
    for (const userAccount of userAccounts) {
      await this.userAccountRepository.save(userAccount as UserAccount);
    }

    return { success: true };
  }

  async deleteUserAccounts(userAccounts: UserAccountDto[]) {
    for (const userAccount of userAccounts) {
      await this.userAccountRepository.delete({
        userId: userAccount.userId,
        accountId: userAccount.accountId,
      });
    }

    return { success: true };
  }

  async getUserAccountIds(user: User): Promise<string[]> {
    let userAccounts: string[] = [];
    if (user?.isSuperAdmin) {
      const accounts = await this.accountsService.findAll(user);
      userAccounts = accounts.map((account) => account.id);

      return userAccounts;
    }

    const ua = await this.userAccountRepository.find({
      where: { userId: user.id },
    });

    return ua.map((account) => account.accountId);
  }
}
