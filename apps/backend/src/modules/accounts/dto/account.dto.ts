import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ description: 'The name of the account' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'The description of the account' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The domain of the account' })
  @IsString()
  domain: string;
}

export class UpdateAccountDto {
  @ApiPropertyOptional({ description: 'The name of the account' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'The description of the account' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'The domain of the account' })
  @IsString()
  @IsOptional()
  domain?: string;
} 