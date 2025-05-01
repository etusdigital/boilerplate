import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { UserAccount } from 'src/entities/user-accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, UserAccount])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
