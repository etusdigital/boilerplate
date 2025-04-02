import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from 'src/entities/user-accounts.entity';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuditModule } from '../audit/audit.module';
import { Auth0Provider } from './providers/auth0.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAccount]),
    AuditModule
  ],
  controllers: [UsersController],
  providers: [UsersService, Auth0Provider],
  exports: [UsersService],
})
export class UsersModule { }
