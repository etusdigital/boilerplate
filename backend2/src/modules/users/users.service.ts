import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrmProvider } from 'src/database/providers/orm.provider';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly ormProvider: OrmProvider,
  ) { }

  async find() {
    return await this.userRepository.find();
  }

  async create(user) {
    // A ideia é que o transactionId seja gerado no cls também. Assim ele será único por request.
    const newUser = await this.userRepository.create(user);
    return await this.ormProvider.createEntity(newUser, this.userRepository, uuidv7());
  }

  async update(id, user) {
    return await this.ormProvider.updateEntity(id, user, this.userRepository, uuidv7());
  }

  async delete(id) {
    return await this.ormProvider.deleteEntity(id, this.userRepository, uuidv7());
  }
}
