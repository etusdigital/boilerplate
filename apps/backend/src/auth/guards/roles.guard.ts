import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UsersService } from 'src/modules/users/users.service';
import { UserAccount } from 'src/entities/user-accounts.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly cls: ClsService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || !requiredRoles.length) return true;

    const request = context.switchToHttp().getRequest();
    const accountId = request.header('account-id');
    if (!accountId) return false;

    const user = await this.userService.findByProviderId(request.user.userId);
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    if (!user.userAccounts) return false;
    const userAccount = user.userAccounts.find(
      (ua: UserAccount) => ua.accountId == accountId,
    );

    if (userAccount) {
      this.cls.set('role', userAccount.role);
      if (!userAccount.role) return false;
      return requiredRoles.includes(userAccount.role);
    }
    return false;
  }
}
