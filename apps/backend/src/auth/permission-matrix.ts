import { Role } from './enums/roles.enum';
import { Permission } from './enums/permissions.enum';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // Highest account-level role (no system settings - those require isSuperAdmin flag)
    Permission.MANAGE_TENANT_SETTINGS,
    Permission.MANAGE_ALL_USERS,
    Permission.MANAGE_TEAM_USERS,
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.EDIT_ANY_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.UNPUBLISH_DELETE_CONTENT,
    Permission.MANAGE_ASSETS,
    Permission.MANAGE_CATEGORIES_TAGS,
    Permission.MANAGE_COMMENTS,
    Permission.VIEW_ALL_CONTENT,
    Permission.VIEW_OWN_CONTENT,
    Permission.VIEW_PUBLISHED_CONTENT,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_REPORTS,
  ],

  [Role.MANAGER]: [
    // Team & workflow management
    Permission.MANAGE_TEAM_USERS,
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.EDIT_ANY_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.UNPUBLISH_DELETE_CONTENT,
    Permission.MANAGE_ASSETS,
    Permission.MANAGE_CATEGORIES_TAGS,
    Permission.MANAGE_COMMENTS,
    Permission.VIEW_ALL_CONTENT,
    Permission.VIEW_OWN_CONTENT,
    Permission.VIEW_PUBLISHED_CONTENT,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_REPORTS,
  ],

  [Role.EDITOR]: [
    // Edit and publish any content
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.EDIT_ANY_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.UNPUBLISH_DELETE_CONTENT,
    Permission.MANAGE_ASSETS,
    Permission.MANAGE_CATEGORIES_TAGS,
    Permission.MANAGE_COMMENTS,
    Permission.VIEW_ALL_CONTENT,
    Permission.VIEW_OWN_CONTENT,
    Permission.VIEW_PUBLISHED_CONTENT,
  ],

  [Role.AUTHOR]: [
    // Create and edit own content only
    Permission.CREATE_CONTENT,
    Permission.EDIT_OWN_CONTENT,
    Permission.MANAGE_ASSETS,
    Permission.VIEW_OWN_CONTENT,
    Permission.VIEW_PUBLISHED_CONTENT,
  ],

  [Role.VIEWER]: [
    // Read-only access to published content
    Permission.VIEW_PUBLISHED_CONTENT,
  ],

  [Role.BILLING]: [
    // Billing and subscription management only
    Permission.MANAGE_BILLING,
    Permission.VIEW_BILLING,
  ],

  [Role.ANALYTICS]: [
    // Analytics and reports access only
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_REPORTS,
  ],
};

export function hasPermission(userRole: Role, requiredPermission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.includes(requiredPermission);
}

export function hasAnyPermission(userRole: Role, requiredPermissions: Permission[]): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return requiredPermissions.some((permission) => rolePermissions.includes(permission));
}

export function hasAllPermissions(userRole: Role, requiredPermissions: Permission[]): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return requiredPermissions.every((permission) => rolePermissions.includes(permission));
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}
