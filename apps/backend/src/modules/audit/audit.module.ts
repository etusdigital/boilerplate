import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from 'src/entities/audit-log.entity';
import { AuditSubscriber } from './subscribers/audit.subscriber';
import { AuditService } from './audit.service';
import { AuditListener } from './audit.listener';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [
    AuditSubscriber, // TypeORM subscriber (automatic)
    AuditListener, // Event-driven listener (explicit)
    AuditService,
  ],
  exports: [AuditSubscriber, AuditListener, AuditService],
})
export class AuditModule {} 