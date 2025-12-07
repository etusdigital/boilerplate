import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from 'src/entities/user-accounts.entity';
import { User } from 'src/entities/user.entity';
import { UserProvider } from 'src/entities/user-provider.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuditModule } from '../audit/audit.module';
import { Auth0Provider } from './providers/auth0.provider';
import { AccountsModule } from '../accounts/accounts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserAccount, UserProvider]),
    AuditModule,
    AccountsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, Auth0Provider],
  exports: [UsersService],
})
export class UsersModule {}
