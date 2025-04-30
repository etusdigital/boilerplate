import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AuditLogFiltersDto {
    @IsOptional()
    @IsString()
    entity?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    entityId?: number;

    @IsOptional()
    @IsString()
    transactionType?: string;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page: number;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    itemsPerPage: number;
} 