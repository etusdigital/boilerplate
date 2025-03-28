# Cursor Rules - API CRUD Architecture Guide

This document outlines the architectural patterns and steps to create new CRUD APIs in our NestJS backend application.

## Table of Contents
1. [Database Migration](#1-database-migration)
2. [Entity Creation](#2-entity-creation)
3. [Module Structure](#3-module-structure)
   - [Module File](#31-module-file)
   - [Controller](#32-controller)
   - [Service](#33-service)
   - [DTOs](#34-dtos)
   - [Tests](#35-tests)

## 1. Database Migration

Migrations should be created in the `src/database/migrations` directory. Follow these naming conventions:

```typescript
{timestamp}-create-{entity-name}-table.ts
```

Example structure:

```typescript
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Create{EntityName}Table{timestamp} implements MigrationInterface {
    private table = new Table({
        name: 'table_name',
        columns: [
            {
                name: 'id',
                type: 'integer',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
            },
            // Add your columns here using snake_case
            {
                name: 'created_at',
                type: 'TIMESTAMP',
                isNullable: false,
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMP',
                isNullable: true,
                onUpdate: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'deleted_at',
                type: 'TIMESTAMP',
                isNullable: true,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table);
    }
}
```

Key points:
- Use snake_case for column names in the database
- Always include `id`, `created_at`, `updated_at`, and `deleted_at` columns
- Specify appropriate column types and constraints

## 2. Entity Creation

Entities should be created in the `src/entities` directory. Follow these conventions:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('table_name')
export class EntityName {
    @PrimaryGeneratedColumn()
    id: number;

    // Add your columns here using camelCase
    @Column({ type: 'varchar', length: 255 })
    exampleField: string;

    @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
    deletedAt?: Date;
}
```

Key points:
- Use camelCase for property names in entities
- Use decorators to map snake_case database columns to camelCase properties
- Include TypeORM decorators with appropriate configurations

## 3. Module Structure

### 3.1 Module File

Create a new directory in `src/modules/{entity-name}` with the following structure:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmProvider } from 'src/database/providers/orm.provider';
import { EntityName } from 'src/entities/entity-name.entity';
import { EntityNameController } from './entity-name.controller';
import { EntityNameService } from './entity-name.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([EntityName])
    ],
    controllers: [EntityNameController],
    providers: [EntityNameService, OrmProvider],
})
export class EntityNameModule { }
```

### 3.2 Controller

Create `entity-name.controller.ts`:

```typescript
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EntityNameService } from './entity-name.service';
import { EntityNameDto } from './dto/entity-name.dto';

@ApiTags('entity-name')
@Controller('/entity-name')
export class EntityNameController {
    constructor(private readonly entityNameService: EntityNameService) { }

    @Get()
    @ApiResponse({ status: 200, description: 'List of entities.' })
    async find() {
        return await this.entityNameService.find();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiResponse({ status: 201, description: 'Entity created.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    async create(@Body() createDto: EntityNameDto) {
        return await this.entityNameService.create(createDto);
    }

    @Put('/:id')
    @UsePipes(new ValidationPipe())
    @ApiResponse({ status: 200, description: 'Entity updated.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    async update(@Param('id') id: number, @Body() updateDto: EntityNameDto) {
        return await this.entityNameService.update(id, updateDto);
    }

    @Delete('/:id')
    @ApiResponse({ status: 200, description: 'Entity deleted.' })
    async delete(@Param('id') id: number) {
        return await this.entityNameService.delete(id);
    }
}
```

### 3.3 Service

Create `entity-name.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrmProvider } from '../../database/providers/orm.provider';
import { EntityName } from '../../entities/entity-name.entity';
import { EntityNameDto } from './dto/entity-name.dto';

@Injectable()
export class EntityNameService {
    constructor(
        @InjectRepository(EntityName)
        private readonly repository: Repository<EntityName>,
        private readonly ormProvider: OrmProvider,
    ) { }

    async find() {
        return await this.repository.find();
    }

    async create(dto: EntityNameDto) {
        const newEntity = await this.repository.create(dto);
        return await this.ormProvider.createEntity(newEntity, this.repository);
    }

    async update(id: number, dto: EntityNameDto) {
        return await this.ormProvider.updateEntity(id, dto, this.repository);
    }

    async delete(id: number) {
        return await this.ormProvider.softDeleteEntity(id, this.repository);
    }
}
```

### 3.4 DTOs

Create a `dto` directory inside your module with:

```typescript
// dto/entity-name.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class EntityNameDto {
    @IsNotEmpty()
    @IsString()
    exampleField: string;

    // Add other fields with appropriate validators
}
```

### 3.5 Tests

Create `entity-name.spec.ts` for your tests:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { EntityNameController } from './entity-name.controller';
import { EntityNameService } from './entity-name.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityName } from '../../entities/entity-name.entity';
import { OrmProvider } from '../../database/providers/orm.provider';

describe('EntityNameController', () => {
    let controller: EntityNameController;
    let service: EntityNameService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EntityNameController],
            providers: [
                EntityNameService,
                OrmProvider,
                {
                    provide: getRepositoryToken(EntityName),
                    useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<EntityNameController>(EntityNameController);
        service = module.get<EntityNameService>(EntityNameService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    // Add your test cases here
});
```

## Best Practices

1. **Naming Conventions**:
   - Use snake_case for database columns
   - Use camelCase for entity properties
   - Use PascalCase for classes and decorators

2. **API Documentation**:
   - Always use Swagger decorators (@ApiTags, @ApiResponse, etc.)
   - Provide meaningful descriptions for endpoints

3. **Validation**:
   - Use class-validator decorators in DTOs
   - Always use ValidationPipe for incoming requests

4. **Error Handling**:
   - Implement proper error handling in services
   - Use appropriate HTTP status codes

5. **Testing**:
   - Write unit tests for controllers and services
   - Mock dependencies appropriately
   - Test both success and error scenarios 