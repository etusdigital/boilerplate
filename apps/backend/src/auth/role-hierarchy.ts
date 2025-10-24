import { Role } from './enums/roles.enum';

/**
 * Role hierarchy with numeric values - lower numbers = higher privileges
 *
 * Note: This hierarchy is for account-specific roles only.
 * System administrators use the isSuperAdmin flag which bypasses this hierarchy.
 *
 * Account Role Hierarchy:
 * - ADMIN: Highest account role, manages account settings and users
 * - MANAGER: Team and workflow management
 * - EDITOR: Content management
 * - AUTHOR: Content creation
 * - VIEWER: Read-only access
 * - BILLING/ANALYTICS: Special purpose roles
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.ADMIN]: 0,
  [Role.MANAGER]: 1,
  [Role.EDITOR]: 2,
  [Role.AUTHOR]: 3,
  [Role.VIEWER]: 4,
  // Special non-hierarchical roles
  [Role.BILLING]: -1,
  [Role.ANALYTICS]: -1,
};

/**
 * Check if a user role meets the minimum role requirement
 * @param userRole - The user's current role
 * @param minimumRole - The minimum required role
 * @param additionalRoles - Additional non-hierarchical roles that are allowed
 * @returns true if user has sufficient privileges
 */
export function hasMinimumRole(userRole: Role, minimumRole: Role, additionalRoles: Role[] = []): boolean {
  // Check if user has one of the additional non-hierarchical roles
  if (additionalRoles.includes(userRole)) {
    return true;
  }

  // Get hierarchy values
  const userHierarchyLevel = ROLE_HIERARCHY[userRole];
  const minimumHierarchyLevel = ROLE_HIERARCHY[minimumRole];

  // Special roles (BILLING, ANALYTICS) can only access through additional roles
  if (userHierarchyLevel === -1) {
    return false;
  }

  // Invalid minimum role
  if (minimumHierarchyLevel === -1) {
    return false;
  }

  // Lower or equal hierarchy value means higher or equal privilege
  return userHierarchyLevel <= minimumHierarchyLevel;
}

/**
 * Get all roles that meet the minimum requirement
 * @param minimumRole - The minimum required role
 * @param additionalRoles - Additional non-hierarchical roles that are allowed
 * @returns Array of roles that have access
 */
export function getRolesWithMinimumAccess(minimumRole: Role, additionalRoles: Role[] = []): Role[] {
  const minimumHierarchyLevel = ROLE_HIERARCHY[minimumRole];

  if (minimumHierarchyLevel === -1) {
    // If minimum role is special, only return additional roles
    return additionalRoles;
  }

  const hierarchicalRoles = Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level !== -1 && level <= minimumHierarchyLevel)
    .map(([role]) => role as Role);

  return [...hierarchicalRoles, ...additionalRoles];
}

/**
 * Check if a role is hierarchical (not a special role like BILLING/ANALYTICS)
 * @param role - Role to check
 * @returns true if role is in hierarchy
 */
export function isHierarchicalRole(role: Role): boolean {
  return ROLE_HIERARCHY[role] !== -1;
}

/**
 * Get the role hierarchy level (for debugging/documentation)
 * @param role - Role to get level for
 * @returns Hierarchy level or -1 for special roles
 */
export function getRoleLevel(role: Role): number {
  return ROLE_HIERARCHY[role];
}
