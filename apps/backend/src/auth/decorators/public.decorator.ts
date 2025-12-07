import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route or controller as public.
 * Routes marked with @Public() will skip JWT authentication.
 *
 * Usage:
 * ```
 * @Public()
 * @Get('health')
 * async healthCheck() { ... }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
