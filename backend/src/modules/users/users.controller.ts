import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserAccountDto } from './dto/user-account.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/roles.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('users')
@Controller('/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(Role.ADMIN, Role.MASTER_ADMIN)
  @ApiResponse({ status: 200, description: 'List of users.' })
  async find() {
    return await this.usersService.find();
  }

  @Post('/login')
  @Roles(Role.ADMIN, Role.MASTER_ADMIN, Role.READER, Role.WRITER)
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User login.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({
    type: LoginDto,
    isArray: true,
    description: 'Login of auth0 user'
  })
  async login(@Body() userLogin: LoginDto, @Req() request) {
    return await this.usersService.login(userLogin, request.user);
  }

  @Post('/accounts')
  @Roles(Role.ADMIN, Role.MASTER_ADMIN)
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
  @Roles(Role.ADMIN, Role.MASTER_ADMIN)
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
  @Roles(Role.ADMIN, Role.MASTER_ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createUserDto: UserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.MASTER_ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'User updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async update(@Param('id') id: number, @Body() updateUserDto: UserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN, Role.MASTER_ADMIN)
  @ApiResponse({ status: 200, description: 'User deleted.' })
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
