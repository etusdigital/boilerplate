import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserAccountInput {
  @ApiProperty()
  accountId: number;
}

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  profileImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  deletedAt?: Date;
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiProperty({ required: false, type: [UserAccountInput] })
  @IsOptional()
  @IsArray()
  userAccounts?: UserAccountInput[];

  @ApiProperty({ required: true })
  @IsBoolean()
  isSuperAdmin?: boolean;
}
