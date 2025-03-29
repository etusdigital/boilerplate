import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserAccountDto } from './dto/user-account.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'List of users.' })
  async find() {
    return await this.usersService.find();
  }

  @Post('/accounts')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User accounts created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({
    type: UserAccountDto,
    isArray: true,
    description: 'Array of user accounts to create'
  })
  async createUserAccounts(@Body() userAccounts: UserAccountDto[]) {
    return await this.usersService.createUserAccounts(userAccounts);
  }

  @Delete('/accounts')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'User accounts deleted.' })
  @ApiBody({
    type: UserAccountDto,
    isArray: true,
    description: 'Array of user accounts to delete'
  })
  async deleteUserAccounts(@Body() userAccounts: UserAccountDto[]) {
    return await this.usersService.deleteUserAccounts(userAccounts);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createUserDto: UserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'User updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async update(@Param('id') id: number, @Body() updateUserDto: UserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @ApiResponse({ status: 200, description: 'User deleted.' })
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
