import { Injectable } from '@nestjs/common';
import { Account } from 'src/entities/account.entity';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

@Injectable()
export default class AccountSeeder implements Seeder {
  public async run(
    dataSource: DataSource
  ): Promise<any> {
    const repository = dataSource.getRepository(Account);
    await repository.insert([
      { name: 'Unum', domain: 'unum.com' },
      { name: 'Plusdin', domain: 'plusdin.com' },
    ]);
  }
}
