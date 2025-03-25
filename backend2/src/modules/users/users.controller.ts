import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async find() {
    return await this.usersService.find();
  }

  @Post()
  async create(@Body() user: any) {
    return await this.usersService.create(user);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() user: any) {
    return await this.usersService.update(id, user);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
