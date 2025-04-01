import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}