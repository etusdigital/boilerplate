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

  @ApiPropertyOptional({ description: 'The domain of the account' })
  @IsString()
  @IsOptional()
  domain?: string;
}

export class UpdateAccountDto {
  @ApiProperty({ required: true })
  @IsOptional()
  id: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  deletedAt?: Date;
}
