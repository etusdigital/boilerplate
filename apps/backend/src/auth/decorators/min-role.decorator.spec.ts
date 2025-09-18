import { Controller, Get } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { MinRole, MIN_ROLE_KEY, ADDITIONAL_ROLES_KEY } from './min-role.decorator';

describe('MinRole Decorator', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  describe('Method-level decoration', () => {
    @Controller('test')
    class TestController {
      @Get('method-only')
      @MinRole(Role.AUTHOR)
      methodWithRole() {}

      @Get('method-with-additional')
      @MinRole(Role.ADMIN, { additional: [Role.BILLING] })
      methodWithAdditionalRoles() {}
    }

    it('should set method-level metadata for role', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const methodWithRole = TestController.prototype.methodWithRole;
      const role = reflector.get<Role>(MIN_ROLE_KEY, methodWithRole);
      expect(role).toBe(Role.AUTHOR);
    });

    it('should set method-level metadata for additional roles', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const methodWithAdditionalRoles = TestController.prototype.methodWithAdditionalRoles;
      const additionalRoles = reflector.get<Role[]>(ADDITIONAL_ROLES_KEY, methodWithAdditionalRoles);
      expect(additionalRoles).toEqual([Role.BILLING]);
    });
  });

  describe('Controller-level decoration', () => {
    @Controller('test')
    @MinRole(Role.ADMIN)
    class ControllerWithRole {
      @Get('inherits')
      methodInheritsFromController() {}

      @Get('overrides')
      @MinRole(Role.VIEWER)
      methodOverridesController() {}
    }

    it('should set controller-level metadata', () => {
      const role = reflector.get<Role>(MIN_ROLE_KEY, ControllerWithRole);
      expect(role).toBe(Role.ADMIN);
    });

    it('should allow method to override controller-level role', () => {
      // Controller level
      const controllerRole = reflector.get<Role>(MIN_ROLE_KEY, ControllerWithRole);
      expect(controllerRole).toBe(Role.ADMIN);

      // Method level override
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const methodOverridesController = ControllerWithRole.prototype.methodOverridesController;
      const methodRole = reflector.get<Role>(MIN_ROLE_KEY, methodOverridesController);
      expect(methodRole).toBe(Role.VIEWER);
    });

    it('should use getAllAndOverride to prioritize method over controller', () => {
      // Simulate how RolesGuard works
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const methodOverridesController = ControllerWithRole.prototype.methodOverridesController;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const methodInheritsFromController = ControllerWithRole.prototype.methodInheritsFromController;

      const methodRole = reflector.getAllAndOverride<Role>(MIN_ROLE_KEY, [
        methodOverridesController,
        ControllerWithRole,
      ]);
      expect(methodRole).toBe(Role.VIEWER); // Method overrides controller

      const inheritedRole = reflector.getAllAndOverride<Role>(MIN_ROLE_KEY, [
        methodInheritsFromController,
        ControllerWithRole,
      ]);
      expect(inheritedRole).toBe(Role.ADMIN); // Inherits from controller
    });
  });

  describe('Mixed controller and method decoration', () => {
    @Controller('test')
    @MinRole(Role.MANAGER, { additional: [Role.ANALYTICS] })
    class MixedController {
      @Get('inherits-all')
      methodInheritsEverything() {}

      @Get('overrides-role')
      @MinRole(Role.AUTHOR)
      methodOverridesRole() {}

      @Get('overrides-additional')
      @MinRole(Role.MANAGER, { additional: [Role.BILLING] })
      methodOverridesAdditional() {}
    }

    it('should handle mixed controller and method additional roles correctly', () => {
      // Controller additional roles
      const controllerAdditional = reflector.get<Role[]>(ADDITIONAL_ROLES_KEY, MixedController);
      expect(controllerAdditional).toEqual([Role.ANALYTICS]);

      // Method override additional roles
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const methodOverridesAdditional = MixedController.prototype.methodOverridesAdditional;
      const methodAdditional = reflector.get<Role[]>(ADDITIONAL_ROLES_KEY, methodOverridesAdditional);
      expect(methodAdditional).toEqual([Role.BILLING]);

      // Using getAllAndOverride for additional roles (method should override)
      const resolvedAdditional = reflector.getAllAndOverride<Role[]>(ADDITIONAL_ROLES_KEY, [
        methodOverridesAdditional,
        MixedController,
      ]);
      expect(resolvedAdditional).toEqual([Role.BILLING]);
    });
  });
});
