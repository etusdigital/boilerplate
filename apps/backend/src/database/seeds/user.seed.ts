import { Injectable } from '@nestjs/common';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserAccount } from 'src/entities/user-accounts.entity';

@Injectable()
export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    const repositoryUserAccount = dataSource.getRepository(UserAccount);
    await repository.insert([
      { name: 'Admin', email: 'admin@etus.com', status: 'accepted', profileImage: 'https://s.gravatar.com/avatar/68f50cfb15b5e0306fc7f113557a681c?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fad.png', isSuperAdmin: true, providerId: 'auth0|68127804d1eebde99eb75614' },
    ]);
    await repositoryUserAccount.insert([
      { userId: 1, accountId: 1 },
    ]);
  }
}
