import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from '../../entities/audit-log.entity'

@Injectable()
export class OrmProvider {
    constructor() { }

    async createEntity(
        entity: any,
        repository: Repository<any>,
        transactionId: string
    ) {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const newEntity = await queryRunner.manager.save(repository.target, entity);
            
            // A ideia aqui é jogar isso para outra função para não fica repetindo
            const audit = { account_id: 1, user_id: 1, transaction_id: transactionId, entity: (repository.target as any).name, entity_id: newEntity.id || 0, transaction_type: 'insert', json: entity };
            await queryRunner.manager.save(AuditLog, audit);
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
        repository: Repository<any>,
        transactionId: string
    ) {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.update(repository.target, entityId, entity);
            const audit = { account_id: 1, user_id: 1, transaction_id: transactionId, entity: (repository.target as any).name, entity_id: entityId, transaction_type: 'update', json: entity };
            await queryRunner.manager.save(AuditLog, audit);
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
        entityId: number,
        repository: Repository<any>,
        transactionId: string
    ) {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.softDelete(repository.target, entityId);
            const audit = { account_id: 1, user_id: 1, transaction_id: transactionId, entity: (repository.target as any).name, entity_id: entityId, transaction_type: 'delete', json: {} };
            await queryRunner.manager.save(AuditLog, audit);
            await queryRunner.commitTransaction();

            return { success: true };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Erro na transação: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }
}
