import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { AuditLog } from 'src/entities/audit-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(AuditLog)
    private readonly logRepository: Repository<AuditLog>,
  ) { }

  async find() {
    // return await this.accountRepository.find();
    return await this.logRepository.find();
  }
}
