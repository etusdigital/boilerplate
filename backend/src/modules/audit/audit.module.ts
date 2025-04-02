import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from 'src/entities/audit-log.entity';
import { AuditSubscriber } from './subscribers/audit.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog])
  ],
  providers: [AuditSubscriber],
  exports: [AuditSubscriber],
})
export class AuditModule {} 