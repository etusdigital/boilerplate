import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const PERMISSION_LOGIC_KEY = 'permission_logic';

export enum PermissionLogic {
  AND = 'AND', // User must have ALL permissions
  OR = 'OR', // User must have ANY of the permissions
}

export const RequirePermissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);

export const RequirePermissionsWithLogic = (permissions: Permission[], logic: PermissionLogic = PermissionLogic.OR) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    SetMetadata(PERMISSIONS_KEY, permissions)(target, propertyKey, descriptor);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    SetMetadata(PERMISSION_LOGIC_KEY, logic)(target, propertyKey, descriptor);
    return descriptor;
  };
};
