import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { OrmProvider } from 'src/database/providers/orm.provider';
import { UserAccount } from 'src/entities/user-accounts.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly ormProvider: OrmProvider,
    private readonly cls: ClsService
  ) { }

  async find() {
    return await this.userRepository.find();
  }

  async findById() {
    return await this.userRepository.find({ where: { id: this.cls.get('user').id } });
  }

  async create(user) {
    const newUser = await this.userRepository.create(user);
    return await this.ormProvider.createEntity(newUser, this.userRepository);
  }

  async update(id, user) {
    return await this.ormProvider.updateEntity(id, user, this.userRepository);
  }

  async delete(id) {
    return await this.ormProvider.softDeleteEntity(id, this.userRepository);
  }

  async createUserAccounts(userAccounts) {
    for (const userAccount of userAccounts) {
      const newUserAccount = await this.userAccountRepository.create(userAccount);
      await this.ormProvider.createEntity(newUserAccount, this.userAccountRepository);
    }

    return { success: true };
  }

  async deleteUserAccounts(userAccounts) {
    for (const userAccount of userAccounts) {
      await this.ormProvider.deleteEntity(userAccount, this.userAccountRepository);
    }

    return { success: true };
  }
}
