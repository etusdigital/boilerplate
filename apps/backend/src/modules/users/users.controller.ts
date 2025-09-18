import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserAccountDto } from './dto/user-account.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MinRole } from '../../auth/decorators/min-role.decorator';
import { Role } from '../../auth/enums/roles.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { LoginDto } from './dto/login.dto';
import { PaginationQueryDto } from 'src/utils';

@ApiTags('users')
@Controller('/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @MinRole(Role.MANAGER)
  @ApiResponse({ status: 200, description: 'List of users with pagination.' })
  async find(@Query() paginationQuery: PaginationQueryDto) {
    return await this.usersService.findWithPagination(paginationQuery);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User login.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({
    type: LoginDto,
    isArray: true,
    description: 'Login of auth0 user',
  })
  async login(@Body() userLogin: LoginDto, @Req() request: { user: { userId: string; [key: string]: any } }) {
    return await this.usersService.login(userLogin, request.user);
  }

  @Post('/accounts')
  @MinRole(Role.MANAGER)
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User accounts created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({
    type: UserAccountDto,
    isArray: true,
    description: 'Array of user accounts to create',
  })
  async createUserAccounts(@Body() userAccounts: UserAccountDto[]) {
    return await this.usersService.createUserAccounts(userAccounts);
  }

  @Delete('/accounts')
  @MinRole(Role.MANAGER)
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'User accounts deleted.' })
  @ApiBody({
    type: UserAccountDto,
    isArray: true,
    description: 'Array of user accounts to delete',
  })
  async deleteUserAccounts(@Body() userAccounts: UserAccountDto[]) {
    return await this.usersService.deleteUserAccounts(userAccounts);
  }

  @Post()
  @MinRole(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createUserDto: UserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Put('/:id')
  @MinRole(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'User updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @MinRole(Role.ADMIN)
  @ApiResponse({ status: 200, description: 'User deleted.' })
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
