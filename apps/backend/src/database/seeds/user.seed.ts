import { Injectable } from '@nestjs/common';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      { name: 'Unum', email: 'teste@unum.com', status: 'accepted' }
    ]);
  }
}
