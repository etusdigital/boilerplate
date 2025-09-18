import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { Role } from '../enums/roles.enum';
import { MIN_ROLE_KEY, ADDITIONAL_ROLES_KEY } from '../decorators/min-role.decorator';
import { hasMinimumRole } from '../role-hierarchy';
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
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly cls: ClsService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    // Get minimum role requirement
    const minimumRole = this.reflector.getAllAndOverride<Role>(MIN_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Get additional roles (non-hierarchical)
    const additionalRoles =
      this.reflector.getAllAndOverride<Role[]>(ADDITIONAL_ROLES_KEY, [context.getHandler(), context.getClass()]) || [];

    // If no role requirement specified, allow access
    if (!minimumRole) return true;

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
      return this.checkUserRole(fetchedUser, accountId, minimumRole, additionalRoles);
    }

    return this.checkUserRole(user, accountId, minimumRole, additionalRoles);
  }

  private checkUserRole(user: User, accountId: string, minimumRole: Role, additionalRoles: Role[]): boolean {
    /**
     * System-level admin bypass - provides access to all accounts and resources
     * This is intentionally separate from role-based permissions and is used for:
     * - System maintenance and debugging
     * - Emergency access when role assignments are broken
     * - Cross-account operations during migrations
     * - Platform-level administrative tasks
     */
    if (user.isSuperAdmin) {
      this.logger.debug('System admin access granted - bypassing role checks', {
        userId: user.id,
        userEmail: user.email,
        accountId,
        requiredRole: minimumRole,
        additionalRoles,
      });

      // Set a special role identifier for audit purposes
      this.cls.set('role', 'SYSTEM_ADMIN');
      this.cls.set('isSystemAdminAccess', true);

      return true;
    }

    // Standard role-based access control for regular users
    if (!user.userAccounts) return false;
    const userAccount = user.userAccounts.find((ua: UserAccount) => ua.accountId == accountId);

    if (userAccount && userAccount.role) {
      this.cls.set('role', userAccount.role);
      this.cls.set('isSystemAdminAccess', false);

      // Use hierarchical role checking
      return hasMinimumRole(userAccount.role, minimumRole, additionalRoles);
    }

    return false;
  }
}
