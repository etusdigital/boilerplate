import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { AuditLog } from '../../entities/audit-log.entity';
import { ClsService } from 'nestjs-cls';
import { AuditLogFiltersDto } from './dto/audit-log-filters.dto';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly auditLogRepository: Repository<AuditLog>,
        private readonly cls: ClsService,
    ) {}

    async findAuditLogs(filters: AuditLogFiltersDto) {
        const where: FindOptionsWhere<AuditLog> = {accountId: this.cls.get('accountId')};

        if (filters.entity) {
            where.entity = filters.entity;
        }

        if (filters.entityId) {
            where.entityId = filters.entityId;
        }

        if (filters.transactionType) {
            where.transactionType = filters.transactionType;
        }

        const [results, total] = await this.auditLogRepository.findAndCount({
            where,
            relations: ['user'],
            order: { timestamp: 'DESC' },
            skip: (filters.page - 1) * filters.itemsPerPage,
            take: filters.itemsPerPage,
        });

        return {
            data: results,
            total,
        };
    }
} 