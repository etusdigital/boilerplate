import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Account } from '../../entities/account.entity';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { ClsService } from 'nestjs-cls';
import { UserAccount } from '../../entities/user-accounts.entity';
import { User } from '../../entities/user.entity';
import { PaginationQueryDto, createPaginationMeta } from 'src/utils';
import { Role } from 'src/auth/enums/roles.enum';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly cls: ClsService,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const user = this.cls.get<User>('user');

    const account = this.accountRepository.create(createAccountDto);
    const savedAccount = await this.accountRepository.save(account);

    // Create user-account relationship for the creator
    if (user && !user.isSuperAdmin) {
      const userAccount = this.userAccountRepository.create({
        userId: user.id,
        accountId: savedAccount.id,
        role: Role.ADMIN, // Creator gets admin role by default
      });
      await this.userAccountRepository.save(userAccount);
    }

    return savedAccount;
  }

  async findAll(user: User | null = null): Promise<Account[]> {
    if (!user) {
      user = this.cls.get('user');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user?.isSuperAdmin) {
      return await this.accountRepository.find();
    }

    /**
     * TODO: This is a temporary solution to get the accounts for the current user.
     * Maybe we should use a relation OneToMany between Account.
     */
    const userAccounts = await this.userAccountRepository.find({
      where: { userId: user?.id },
      relations: ['account'],
    });

    return userAccounts.map((userAccount) => userAccount.account) as Account[];
  }

  async findAllWithPagination(paginationQuery: PaginationQueryDto, user: User | null = null) {
    if (!user) {
      user = this.cls.get('user');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { page = 1, limit = 50, query } = paginationQuery;
    const skip = (page - 1) * limit;

    if (user?.isSuperAdmin) {
      const whereCondition: any = {};

      // Add search filter if query is provided
      if (query && query.trim()) {
        whereCondition.or = [
          { name: Like(`%${query}%`) },
          { domain: Like(`%${query}%`) },
        ];
      }

      const [accounts, totalItems] = await this.accountRepository.findAndCount({
        where: whereCondition.or ? whereCondition.or : undefined,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      const meta = createPaginationMeta(totalItems, page, limit);

      return {
        data: accounts,
        meta,
      };
    }

    // For non-super admin users, get accounts through user-account relationship
    const queryBuilder = this.userAccountRepository
      .createQueryBuilder('userAccount')
      .leftJoinAndSelect('userAccount.account', 'account')
      .where('userAccount.userId = :userId', { userId: user?.id });

    // Add search filter if query is provided
    if (query && query.trim()) {
      queryBuilder.andWhere(
        '(account.name LIKE :query OR account.domain LIKE :query)',
        { query: `%${query}%` },
      );
    }

    const [userAccounts, totalItems] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('account.createdAt', 'DESC')
      .getManyAndCount();

    const accounts = userAccounts.map((userAccount) => userAccount.account) as Account[];
    const meta = createPaginationMeta(totalItems, page, limit);

    return {
      data: accounts,
      meta,
    };
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    await this.accountRepository.update(id, { ...updateAccountDto, id });
    return await this.findOne(id);
  }
}
