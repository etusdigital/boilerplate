import { Controller, Get, Post, Put, Body, Param, UseGuards, ValidationPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { MinRole } from 'src/auth/decorators/min-role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationQueryDto } from 'src/utils';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @MinRole(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: 201,
    description: 'The account has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body(ValidationPipe) createAccountDto: CreateAccountDto) {
    return await this.accountsService.create(createAccountDto);
  }

  @Get()
  @MinRole(Role.ADMIN)
  @ApiOperation({ summary: 'Get all accounts with pagination' })
  @ApiResponse({ status: 200, description: 'Return paginated accounts.' })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return await this.accountsService.findAllWithPagination(paginationQuery);
  }

  @Get(':id')
  @MinRole(Role.ADMIN)
  @ApiOperation({ summary: 'Get an account by id' })
  @ApiResponse({ status: 200, description: 'Return the account.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async findOne(@Param('id') id: string) {
    return await this.accountsService.findOne(id);
  }

  @Put(':id')
  @MinRole(Role.ADMIN)
  @ApiOperation({ summary: 'Update an account' })
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateAccountDto: UpdateAccountDto) {
    return await this.accountsService.update(id, updateAccountDto);
  }
}
