import { Injectable } from '@nestjs/common';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserAccount } from 'src/entities/user-accounts.entity';
import { Account } from 'src/entities/account.entity';
import { Role } from 'src/auth/enums/roles.enum';

@Injectable()
export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    const repositoryUserAccount = dataSource.getRepository(UserAccount);
    const users = await repository.insert([
      {
        name: 'Super Admin User',
        email: 'superadmin@etus.com',
        status: 'accepted',
        isSuperAdmin: true,
        providerIds: ['test-superadmin-001'],
      },
      {
        name: 'Admin User',
        email: 'admin@etus.com',
        status: 'accepted',
        isSuperAdmin: false,
        providerIds: ['test-admin-001'],
      },
      {
        name: 'Manager User',
        email: 'manager@etus.com',
        status: 'accepted',
        isSuperAdmin: false,
        providerIds: ['test-manager-001'],
      },
      {
        name: 'Editor User',
        email: 'editor@etus.com',
        status: 'accepted',
        isSuperAdmin: false,
        providerIds: ['test-editor-001'],
      },
      {
        name: 'Author User',
        email: 'author@etus.com',
        status: 'accepted',
        isSuperAdmin: false,
        providerIds: ['test-author-001'],
      },
      {
        name: 'Viewer User',
        email: 'viewer@etus.com',
        status: 'accepted',
        isSuperAdmin: false,
        providerIds: ['test-viewer-001'],
      },
    ]);

    if (users.identifiers.length === 0) {
      return;
    }

    const account = await dataSource.getRepository(Account).findOne({ where: { name: 'Etus' } });
    if (!account) {
      return;
    }

    // Create user accounts with different roles for testing
    // Note: First user (Super Admin) is system admin via isSuperAdmin flag, so starts with ADMIN account role
    const userAccounts = users.identifiers.map((identifier, index) => {
      const roles = [Role.ADMIN, Role.ADMIN, Role.MANAGER, Role.EDITOR, Role.AUTHOR, Role.VIEWER];
      return {
        userId: identifier.id as string,
        accountId: account.id,
        role: roles[index] || Role.VIEWER,
      };
    });

    await repositoryUserAccount.insert(userAccounts);
  }
}
