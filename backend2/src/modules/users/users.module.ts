import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmProvider } from 'src/database/providers/orm.provider';
import { UserAccount } from 'src/entities/user-accounts.entity';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAccount])
  ],
  controllers: [UsersController],
  providers: [UsersService, OrmProvider],
})
export class UsersModule { }
