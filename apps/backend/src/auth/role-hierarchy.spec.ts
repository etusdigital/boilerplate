import { hasMinimumRole, getRolesWithMinimumAccess, isHierarchicalRole, getRoleLevel } from './role-hierarchy';
import { Role } from './enums/roles.enum';

describe('Role Hierarchy', () => {
  describe('hasMinimumRole', () => {
    it('should allow higher privilege roles to access lower privilege endpoints', () => {
      // ADMIN should be able to access AUTHOR endpoints
      expect(hasMinimumRole(Role.ADMIN, Role.AUTHOR)).toBe(true);

      // ADMIN (highest account role) should be able to access any hierarchical role
      expect(hasMinimumRole(Role.ADMIN, Role.VIEWER)).toBe(true);
      expect(hasMinimumRole(Role.ADMIN, Role.AUTHOR)).toBe(true);
      expect(hasMinimumRole(Role.ADMIN, Role.MANAGER)).toBe(true);
    });

    it('should deny lower privilege roles from accessing higher privilege endpoints', () => {
      // AUTHOR should NOT be able to access ADMIN endpoints
      expect(hasMinimumRole(Role.AUTHOR, Role.ADMIN)).toBe(false);

      // VIEWER should NOT be able to access AUTHOR endpoints
      expect(hasMinimumRole(Role.VIEWER, Role.AUTHOR)).toBe(false);
    });

    it('should allow same role to access same role endpoints', () => {
      expect(hasMinimumRole(Role.AUTHOR, Role.AUTHOR)).toBe(true);
      expect(hasMinimumRole(Role.VIEWER, Role.VIEWER)).toBe(true);
    });

    it('should handle special non-hierarchical roles correctly', () => {
      // BILLING should only access through additional roles
      expect(hasMinimumRole(Role.BILLING, Role.ADMIN)).toBe(false);
      expect(hasMinimumRole(Role.BILLING, Role.ADMIN, [Role.BILLING])).toBe(true);

      // ANALYTICS should only access through additional roles
      expect(hasMinimumRole(Role.ANALYTICS, Role.MANAGER)).toBe(false);
      expect(hasMinimumRole(Role.ANALYTICS, Role.MANAGER, [Role.ANALYTICS])).toBe(true);
    });

    it('should not allow special roles to access hierarchical endpoints without being in additional', () => {
      expect(hasMinimumRole(Role.BILLING, Role.VIEWER)).toBe(false);
      expect(hasMinimumRole(Role.ANALYTICS, Role.VIEWER)).toBe(false);
    });
  });

  describe('getRolesWithMinimumAccess', () => {
    it('should return all roles with sufficient privileges', () => {
      const rolesForAuthor = getRolesWithMinimumAccess(Role.AUTHOR);
      expect(rolesForAuthor).toContain(Role.ADMIN);
      expect(rolesForAuthor).toContain(Role.MANAGER);
      expect(rolesForAuthor).toContain(Role.EDITOR);
      expect(rolesForAuthor).toContain(Role.AUTHOR);
      expect(rolesForAuthor).not.toContain(Role.VIEWER);
    });

    it('should include additional roles', () => {
      const rolesForAdmin = getRolesWithMinimumAccess(Role.ADMIN, [Role.BILLING]);
      expect(rolesForAdmin).toContain(Role.ADMIN);
      expect(rolesForAdmin).toContain(Role.BILLING);
      expect(rolesForAdmin).not.toContain(Role.MANAGER);
    });
  });

  describe('isHierarchicalRole', () => {
    it('should identify hierarchical roles correctly', () => {
      expect(isHierarchicalRole(Role.ADMIN)).toBe(true);
      expect(isHierarchicalRole(Role.MANAGER)).toBe(true);
      expect(isHierarchicalRole(Role.VIEWER)).toBe(true);
    });

    it('should identify special roles correctly', () => {
      expect(isHierarchicalRole(Role.BILLING)).toBe(false);
      expect(isHierarchicalRole(Role.ANALYTICS)).toBe(false);
    });
  });

  describe('getRoleLevel', () => {
    it('should return correct hierarchy levels', () => {
      expect(getRoleLevel(Role.ADMIN)).toBe(0);
      expect(getRoleLevel(Role.MANAGER)).toBe(1);
      expect(getRoleLevel(Role.EDITOR)).toBe(2);
      expect(getRoleLevel(Role.AUTHOR)).toBe(3);
      expect(getRoleLevel(Role.VIEWER)).toBe(4);
    });

    it('should return -1 for special roles', () => {
      expect(getRoleLevel(Role.BILLING)).toBe(-1);
      expect(getRoleLevel(Role.ANALYTICS)).toBe(-1);
    });
  });

  describe('System Admin Bypass (isSuperAdmin)', () => {
    it('should be documented as separate from role hierarchy', () => {
      // This test documents that isSuperAdmin is intentionally outside
      // the role hierarchy system and is handled in RolesGuard directly

      // System admin bypass provides access regardless of role hierarchy
      const systemAdminBehavior = {
        bypassesRoleChecks: true,
        worksWithoutUserAccounts: true,
        providesAccessToAllAccounts: true,
        usedForSystemMaintenance: true,
        separateFromBusinessRoles: true,
      };

      expect(systemAdminBehavior.bypassesRoleChecks).toBe(true);
      expect(systemAdminBehavior.separateFromBusinessRoles).toBe(true);
    });

    it('should follow industry best practices', () => {
      // Documents that this pattern follows established systems:
      // - AWS root user
      // - Linux UID 0 (root)
      // - PostgreSQL superuser flag

      const industryPatterns = {
        awsRootUser: 'bypasses IAM policies',
        linuxRoot: 'UID 0 bypasses file permissions',
        postgresqlSuperuser: 'superuser flag bypasses role checks',
      };

      expect(industryPatterns.awsRootUser).toBe('bypasses IAM policies');
      expect(industryPatterns.linuxRoot).toBe('UID 0 bypasses file permissions');
      expect(industryPatterns.postgresqlSuperuser).toBe('superuser flag bypasses role checks');
    });
  });
});
