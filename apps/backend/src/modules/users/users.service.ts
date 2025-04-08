import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { UserAccount } from '../../entities/user-accounts.entity';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserAccountDto } from './dto/user-account.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Provider } from './providers/auth0.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly cls: ClsService,
    private readonly auth0Provider: Auth0Provider,
  ) {}

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

  async create(user: UserDto) {
    const newUser = await this.userRepository.create({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      status: 'invited',
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

    console.log('createdTicket', createdTicket);

    return savedUser;
  }

  async update(id: number, user: UserDto) {
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
      });

      user.userAccounts.forEach((account) => {
        if (!receivedAccounts.some((a) => a.accountId === account.accountId)) {
          uaDel.push({
            accountId: account.accountId,
            userId: id,
          });
        }
      });

      delete user.userAccounts;

      await this.userRepository.update(id, { ...user, id });

      await this.createUserAccounts(uaAdd);
      console.log('uaAdd', uaAdd, user);

      await this.deleteUserAccounts(uaDel);
      console.log('uaDel', uaDel, user);

      return await this.userRepository.findOne({
        where: { id },
      });
    }
  }

  async delete(id: number) {
    return await this.userRepository.softDelete(id);
  }

  async login(userLogin: LoginDto, jwtUser) {
    const user = await this.userRepository.findOne({
      where: { email: userLogin.email },
    });
    if (user && user.status === 'invited') {
      user.status = 'accepted';
      user.providerId = jwtUser.userId;
      await this.userRepository.save(user);
    }
    return user;
  }

  async createUserAccounts(userAccounts: UserAccountDto[]) {
    for (const userAccount of userAccounts) {
      const newUserAccount =
        await this.userAccountRepository.create(userAccount);
      await this.userAccountRepository.save(newUserAccount);
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
