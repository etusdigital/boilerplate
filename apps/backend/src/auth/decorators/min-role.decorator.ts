import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

export const MIN_ROLE_KEY = 'min_role';
export const ADDITIONAL_ROLES_KEY = 'additional_roles';

export interface MinRoleOptions {
  /**
   * Additional non-hierarchical roles that should have access
   * (e.g., BILLING, ANALYTICS)
   */
  additional?: Role[];
}

/**
 * Decorator to specify minimum role requirement for an endpoint or entire controller
 * Uses role hierarchy - users with higher privileges also have access
 *
 * @param minimumRole - The minimum role required for access
 * @param options - Additional options including non-hierarchical roles
 *
 * @example
 * // Method level - only AUTHOR and above can access this endpoint
 * @Get('posts')
 * @MinRole(Role.AUTHOR)
 * async getPosts() {}
 *
 * @example
 * // Controller level - all endpoints require ADMIN by default
 * @Controller('admin')
 * @MinRole(Role.ADMIN)
 * export class AdminController {}
 *
 * @example
 * // Method override - controller requires ADMIN, but this endpoint allows VIEWER
 * @Controller('admin')
 * @MinRole(Role.ADMIN)
 * export class AdminController {
 *   @Get('public-stats')
 *   @MinRole(Role.VIEWER)  // Overrides controller-level requirement
 *   async getStats() {}
 * }
 *
 * @example
 * // ADMIN and above, plus BILLING role
 * @MinRole(Role.ADMIN, { additional: [Role.BILLING] })
 */
export const MinRole = (minimumRole: Role, options: MinRoleOptions = {}) => {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any => {
    if (propertyKey && descriptor) {
      // Method decorator
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      SetMetadata(MIN_ROLE_KEY, minimumRole)(target, propertyKey, descriptor);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      SetMetadata(ADDITIONAL_ROLES_KEY, options.additional || [])(target, propertyKey, descriptor);
      return descriptor;
    } else {
      // Class decorator
      SetMetadata(MIN_ROLE_KEY, minimumRole)(target);
      SetMetadata(ADDITIONAL_ROLES_KEY, options.additional || [])(target);

      return target;
    }
  };
};
