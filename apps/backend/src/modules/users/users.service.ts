import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { UserAccount } from '../../entities/user-accounts.entity';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserAccountDto } from './dto/user-account.dto';
import { LoginDto } from './dto/login.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { Auth0Provider } from './providers/auth0.provider';
import { AccountsService } from '../accounts/accounts.service';
import { Role } from 'src/auth/enums/roles.enum';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly cls: ClsService,
    private readonly auth0Provider: Auth0Provider,
    private readonly accountsService: AccountsService,
  ) {}

  /**
   * Create pagination metadata
   */
  private createPaginationMeta(
    totalItems: number,
    page: number,
    limit: number,
  ): PaginationMetaDto {
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return {
      currentPage,
      limit,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  }

  /**
   * Find users with pagination and filters - OPTIMIZED VERSION
   */
  async findAllPaginated(
    queryDto: UsersQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    // Calculate pagination values
    let skip = 0;
    const limit = queryDto.limit || 10;
    const page = queryDto.page || 1;

    if (queryDto.offset !== undefined) {
      skip = queryDto.offset;
    } else {
      skip = (page - 1) * limit;
    }

    // Build base query for counting (optimized)
    const countQueryBuilder = this.userRepository.createQueryBuilder('user');
    
    // Apply filters to count query
    if (queryDto.search) {
      countQueryBuilder.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    if (queryDto.status) {
      countQueryBuilder.andWhere('user.status = :status', { status: queryDto.status });
    }

    // For role filter, use EXISTS for better performance
    if (queryDto.role) {
      countQueryBuilder.andWhere(
        'EXISTS (SELECT 1 FROM user_accounts ua WHERE ua.userId = user.id AND ua.role = :role)',
        { role: queryDto.role }
      );
    }

    // Get total count
    const totalItems = await countQueryBuilder.getCount();

    // Build data query - only load relations when needed
    const dataQueryBuilder = this.userRepository.createQueryBuilder('user')
      .select([
        'user.id',
        'user.name', 
        'user.email',
        'user.profileImage',
        'user.status',
        'user.isSuperAdmin',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt'
      ]);

    // Only JOIN relations if role filter is needed or if we need role info
    if (queryDto.role) {
      dataQueryBuilder
        .leftJoinAndSelect('user.userAccounts', 'userAccount')
        .leftJoinAndSelect('userAccount.account', 'account');
    }

    // Apply same filters to data query
    if (queryDto.search) {
      dataQueryBuilder.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    if (queryDto.status) {
      dataQueryBuilder.andWhere('user.status = :status', { status: queryDto.status });
    }

    if (queryDto.role) {
      dataQueryBuilder.andWhere('userAccount.role = :role', { role: queryDto.role });
    }

    // Add sorting
    const sortBy = queryDto.sortBy || 'createdAt';
    const sortOrder = queryDto.sortOrder || 'DESC';
    dataQueryBuilder.orderBy(`user.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    // Add pagination
    dataQueryBuilder.skip(skip).take(limit);

    // Execute data query
    const users = await dataQueryBuilder.getMany();

    // Create pagination metadata with correct totalItems
    const meta = this.createPaginationMeta(totalItems, page, limit);

    return {
      data: users,
      meta,
    };
  }

  async find() {
    return await this.userRepository.find();
  }

  async findById() {
    return await this.userRepository.find({
      where: { id: this.cls.get('user').id },
    });
  }

  async findByProviderId(providerId: string) {
    return await this.userRepository.findOne({
      where: { providerId },
    });
  }

  async findOneWithRelations(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userAccounts', 'userAccounts.account'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(user: UserDto) {
    const newUser = this.userRepository.create({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
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
    const createdTicket = await this.auth0Provider.sendInvitation(
      user.email,
      user.name,
    );

    return savedUser;
  }

  async update(id: number, user: UserDto) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id },
      relations: ['userAccounts'],
    });

    if (userToUpdate) {
      const receivedAccounts = [...(user.userAccounts || [])];

      user.userAccounts = userToUpdate.userAccounts || [];
      const uaAdd: UserAccountDto[] = [];
      const uaDel: UserAccountDto[] = [];

      receivedAccounts.forEach((account) => {
        const existingAccount = user.userAccounts?.find((a) => a.accountId === account.accountId);
        
        if (!existingAccount) {
          // Account não existe, precisa criar
          uaAdd.push({
            ...account,
            userId: id,
          });
        } else if (existingAccount.role !== account.role) {
          // Account existe mas role mudou, precisa deletar o antigo e criar novo
          uaDel.push({
            accountId: existingAccount.accountId,
            userId: id,
            role: existingAccount.role,
          } as UserAccountDto);
          
          uaAdd.push({
            ...account,
            userId: id,
          });
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

      // Atualiza os campos do usuário existente
      Object.assign(userToUpdate, user);
      
      // Executa as operações de userAccounts
      await this.createUserAccounts(uaAdd);
      await this.deleteUserAccounts(uaDel);

      // Sempre salva o usuário para:
      // 1. Atualizar campos modificados do usuário (nome, email, etc.)
      // 2. Forçar atualização do updatedAt quando há mudanças nas roles
      const hasRoleChanges = uaAdd.length > 0 || uaDel.length > 0;
      
      if (hasRoleChanges) {
        // Força atualização do updatedAt quando há mudanças nas roles
        userToUpdate.updatedAt = new Date();
      }
      
      await this.userRepository.save(userToUpdate);

      return await this.userRepository.findOne({
        where: { id },
        relations: ['userAccounts', 'userAccounts.account'],
      });
    }
  }

  async delete(id: number) {
    return await this.userRepository.softDelete(id);
  }

  async login(userLogin: LoginDto, jwtUser) {
    // Set these manually since this route is excluded from the middleware that does it.
    this.cls.set('transactionId', uuidv7());
    this.cls.set('accountId', 1);

    const user = await this.userRepository.findOne({
      where: { email: userLogin.email },
      relations: ['userAccounts'],
    });
    if (!user) throw new ForbiddenException();

    this.cls.set('user', { ...user, userAccounts: null });

    if (user.status === 'invited') {
      user.status = 'accepted';
      user.providerId = jwtUser.userId;
      await this.userRepository.save(user);
    }

    /**
     * If user is super admin, we need to get all accounts for the user manually.
     */

    if (user?.isSuperAdmin) {
      const accounts = await this.accountsService.findAll(user);
      user.userAccounts = accounts.map((account) => ({
        accountId: account.id,
        userId: user.id,
        role: Role.ADMIN,
        id: 0,
        account: account,
      }));
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
}
