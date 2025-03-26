import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from '../../entities/audit-log.entity'
import { ClsService } from 'nestjs-cls';

@Injectable()
export class OrmProvider {
    constructor(private readonly cls: ClsService) { }

    async createEntity(
        entity: any,
        repository: Repository<any>
    ) {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const newEntity = await queryRunner.manager.save(repository.target, entity);
            await queryRunner.manager.save(AuditLog, this.formattedAudit(entity, newEntity.id || 0, repository, 'insert'));
            await queryRunner.commitTransaction();

            return { success: true };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Erro na transação: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async updateEntity(
        entityId: number,
        entity: any,
        repository: Repository<any>
    ) {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.update(repository.target, entityId, entity);
            await queryRunner.commitTransaction();
            await queryRunner.manager.save(AuditLog, this.formattedAudit(entity, entityId, repository, 'update'));

            return { success: true };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Erro na transação: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async softDeleteEntity(
        entityId: number | Object,
        repository: Repository<any>
    ) {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.softDelete(repository.target, entityId);
            await queryRunner.manager.save(AuditLog, this.formattedAudit({}, entityId, repository, 'delete'));
            await queryRunner.commitTransaction();

            return { success: true };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Erro na transação: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async deleteEntity(
        entityId: number | Object,
        repository: Repository<any>
    ) {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(repository.target, entityId);
            await queryRunner.manager.save(AuditLog, this.formattedAudit(entityId, entityId, repository, 'delete'));
            await queryRunner.commitTransaction();

            return { success: true };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Erro na transação: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    formattedAudit(json, entityId, repository, transactionType) {
        return {
            accountId: this.cls.get('accountId'),
            userId: this.cls.get('user').id,
            transactionId: this.cls.get('transactionId'),
            entity: (repository.target as any).name,
            entityId,
            transactionType,
            json
        };
    }
}
