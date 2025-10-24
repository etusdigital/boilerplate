import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAccountDto {
  @ApiProperty({
    description: 'The ID of the account',
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}
