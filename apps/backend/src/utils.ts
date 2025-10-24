import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, IsIn } from 'class-validator';
import * as crypto from 'crypto';

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

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Search query term',
    example: 'test',
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order (ASC or DESC)',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export const createPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number,
): PaginationMetaDto => {
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = page;
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return {
    currentPage,
    limit,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

/**
 * Generates a cryptographically strong password that meets Auth0's "Excellent" policy requirements:
 * - At least 16 characters long
 * - Contains at least 3 of 4 character types: lowercase, uppercase, numbers, special characters
 * - No more than 2 identical characters in a row
 *
 * @returns A strong password string
 */
export const generateStrongPassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + special;
  const length = 16;

  // Ensure we have at least one character from each required type
  const requiredChars = [
    lowercase[crypto.randomInt(lowercase.length)],
    uppercase[crypto.randomInt(uppercase.length)],
    numbers[crypto.randomInt(numbers.length)],
    special[crypto.randomInt(special.length)],
  ];

  // Generate remaining characters
  const remainingLength = length - requiredChars.length;
  const remainingChars: string[] = [];

  for (let i = 0; i < remainingLength; i++) {
    remainingChars.push(allChars[crypto.randomInt(allChars.length)]);
  }

  // Combine and shuffle
  const passwordArray = [...requiredChars, ...remainingChars];

  // Fisher-Yates shuffle
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  const password = passwordArray.join('');

  // Ensure no more than 2 consecutive identical characters
  while (/(.)\1{2,}/.test(password)) {
    // Regenerate if we have 3+ consecutive identical characters
    return generateStrongPassword();
  }

  return password;
};
