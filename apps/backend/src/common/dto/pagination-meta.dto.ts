import { ApiProperty } from '@nestjs/swagger';

// DTO for pagination metadata
export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Indicates if there is a previous page' })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Indicates if there is a next page' })
  hasNextPage: boolean;
} 
