import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
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
    private readonly cls: ClsService
  ) { }

  async find() {
    return await this.userRepository.find();
  }

  async findById() {
    return await this.userRepository.find({ where: { id: this.cls.get('user').id } });
  }

  async create(user: UserDto) {
    const newUser = await this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async update(id: number, user: UserDto) {
    return await this.userRepository.update(id, user);
  }

  async delete(id: number) {
    return await this.userRepository.softDelete(id);
  }

  async createUserAccounts(userAccounts: UserAccountDto[]) {
    for (const userAccount of userAccounts) {
      const newUserAccount = await this.userAccountRepository.create(userAccount);
      await this.userAccountRepository.save(newUserAccount);
    }

    return { success: true };
  }

  async deleteUserAccounts(userAccounts: UserAccountDto[]) {
    for (const userAccount of userAccounts) {
      await this.userAccountRepository.delete({ userId: userAccount.userId, accountId: userAccount.accountId });
    }

    return { success: true };
  }
}
