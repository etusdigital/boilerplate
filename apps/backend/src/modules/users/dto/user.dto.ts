import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserAccountInput {
  @ApiProperty()
  accountId: string;

  @ApiProperty()
  @IsOptional()
  role: string;
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
  id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  deletedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  // providerIds is managed internally by the backend when interacting with Auth0
  // It should not be included in create/update requests from the frontend

  @ApiProperty({ required: false, type: [UserAccountInput] })
  @IsOptional()
  @IsArray()
  userAccounts?: UserAccountInput[];

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  isSuperAdmin?: boolean;
}
