import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAccountDto {
  @ApiProperty({
    description: 'The ID of the account',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @ApiProperty({
    description: 'The ID of the user',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}