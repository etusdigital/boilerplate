import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { Permission } from '../enums/permissions.enum';
import { PERMISSIONS_KEY, PERMISSION_LOGIC_KEY, PermissionLogic } from '../decorators/permissions.decorator';
import { hasAnyPermission, hasAllPermissions } from '../permission-matrix';
import { UsersService } from 'src/modules/users/users.service';
import { UserAccount } from 'src/entities/user-accounts.entity';
import { User } from 'src/entities/user.entity';

interface Auth0User {
  userId: string;
  roles: string[];
  permissions: string[];
  email: string;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly cls: ClsService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || !requiredPermissions.length) return true;

    const permissionLogic =
      this.reflector.getAllAndOverride<PermissionLogic>(PERMISSION_LOGIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || PermissionLogic.OR;

    const request = context.switchToHttp().getRequest<Request & { user: Auth0User }>();

    const accountId = request.headers['account-id'] as string;
    if (!accountId) return false;

    // Use user from CLS (set by AccountMiddleware) to avoid redundant DB query
    const user = this.cls.get<User>('user');
    if (!user) {
      // Fallback: if user not in CLS, fetch from DB (for routes excluded from AccountMiddleware)
      const userId = request.user?.userId;
      if (!userId) return false;

      const fetchedUser = await this.userService.findByProviderId(userId);
      if (!fetchedUser) return false;

      // Store in CLS for consistency
      this.cls.set('user', fetchedUser);
      return this.checkUserPermissions(fetchedUser, accountId, requiredPermissions, permissionLogic);
    }

    return this.checkUserPermissions(user, accountId, requiredPermissions, permissionLogic);
  }

  private checkUserPermissions(
    user: User,
    accountId: string,
    requiredPermissions: Permission[],
    logic: PermissionLogic,
  ): boolean {
    // Super admin users bypass all permission checks
    if (user.isSuperAdmin) return true;

    if (!user.userAccounts) return false;
    const userAccount = user.userAccounts.find((ua: UserAccount) => ua.accountId == accountId);

    if (userAccount && userAccount.role) {
      this.cls.set('role', userAccount.role);

      // Check permissions based on logic
      if (logic === PermissionLogic.AND) {
        return hasAllPermissions(userAccount.role, requiredPermissions);
      } else {
        return hasAnyPermission(userAccount.role, requiredPermissions);
      }
    }

    return false;
  }
}
