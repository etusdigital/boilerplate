import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, Public } from './public.decorator';

describe('Public Decorator', () => {
  describe('IS_PUBLIC_KEY', () => {
    it('should export the correct metadata key', () => {
      expect(IS_PUBLIC_KEY).toBe('isPublic');
    });
  });

  describe('@Public()', () => {
    it('should set IS_PUBLIC_KEY metadata to true on a method', () => {
      class TestController {
        @Public()
        publicRoute() {
          return 'public';
        }
      }

      const reflector = new Reflector();
      const metadata = reflector.get(
        IS_PUBLIC_KEY,
        TestController.prototype.publicRoute,
      );

      expect(metadata).toBe(true);
    });

    it('should not set metadata on methods without decorator', () => {
      class TestController {
        privateRoute() {
          return 'private';
        }
      }

      const reflector = new Reflector();
      const metadata = reflector.get(
        IS_PUBLIC_KEY,
        TestController.prototype.privateRoute,
      );

      expect(metadata).toBeUndefined();
    });

    it('should allow mixing public and private routes', () => {
      class TestController {
        @Public()
        healthCheck() {
          return 'health';
        }

        protectedRoute() {
          return 'protected';
        }
      }

      const reflector = new Reflector();

      const publicMetadata = reflector.get(
        IS_PUBLIC_KEY,
        TestController.prototype.healthCheck,
      );
      const privateMetadata = reflector.get(
        IS_PUBLIC_KEY,
        TestController.prototype.protectedRoute,
      );

      expect(publicMetadata).toBe(true);
      expect(privateMetadata).toBeUndefined();
    });

    it('should set metadata on controller class', () => {
      @Public()
      class PublicController {
        route() {
          return 'data';
        }
      }

      const reflector = new Reflector();
      const metadata = reflector.get(IS_PUBLIC_KEY, PublicController);

      expect(metadata).toBe(true);
    });

    it('should not affect other controllers when applied to one', () => {
      @Public()
      class PublicController {}

      class PrivateController {}

      const reflector = new Reflector();

      const publicMetadata = reflector.get(IS_PUBLIC_KEY, PublicController);
      const privateMetadata = reflector.get(IS_PUBLIC_KEY, PrivateController);

      expect(publicMetadata).toBe(true);
      expect(privateMetadata).toBeUndefined();
    });

    it('should be readable by Reflector.getAllAndOverride', () => {
      @Public()
      class TestController {
        route() {
          return 'data';
        }
      }

      const reflector = new Reflector();
      const metadata = reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        TestController.prototype.route,
        TestController,
      ]);

      // Method doesn't have it, but controller does, so should return true
      expect(metadata).toBe(true);
    });

    it('should allow method decorator to override controller decorator', () => {
      @Public()
      class TestController {
        @Public()
        alsoPublicRoute() {
          return 'public';
        }
      }

      const reflector = new Reflector();
      const methodMetadata = reflector.get(
        IS_PUBLIC_KEY,
        TestController.prototype.alsoPublicRoute,
      );
      const classMetadata = reflector.get(IS_PUBLIC_KEY, TestController);

      expect(methodMetadata).toBe(true);
      expect(classMetadata).toBe(true);
    });
  });
});
