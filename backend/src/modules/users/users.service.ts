import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { OrmProvider } from '../../database/providers/orm.provider';
import { UserAccount } from '../../entities/user-accounts.entity';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserAccountDto } from './dto/user-account.dto';

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

  async create(user: UserDto) {
    console.log('chegou aqui', user);
    const newUser = await this.userRepository.create(user);
    console.log('chegou aqui2', user, newUser);
    try {
      const entity = await this.ormProvider.createEntity(newUser, this.userRepository);
      console.log('chegou aqui3', entity);
      return entity;
    } catch (error) {
      console.log('chegou aqui4', error);
      throw error;
    }
  }

  async update(id: number, user: UserDto) {
    return await this.ormProvider.updateEntity(id, user, this.userRepository);
  }

  async delete(id: number) {
    return await this.ormProvider.softDeleteEntity(id, this.userRepository);
  }

  async createUserAccounts(userAccounts: UserAccountDto[]) {
    for (const userAccount of userAccounts) {
      const newUserAccount = await this.userAccountRepository.create(userAccount);
      await this.ormProvider.createEntity(newUserAccount, this.userAccountRepository);
    }

    return { success: true };
  }

  async deleteUserAccounts(userAccounts: UserAccountDto[]) {
    for (const userAccount of userAccounts) {
      await this.ormProvider.deleteEntity(userAccount, this.userAccountRepository);
    }

    return { success: true };
  }
}
