import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { RequestContext } from '../context/request-context';

/**
 * Parameter decorator to inject RequestContext into controller methods.
 *
 * This decorator creates a RequestContext from the CLS store, making the
 * context explicitly available in controller method signatures.
 *
 * Usage:
 * ```typescript
 * @Controller('users')
 * export class UsersController {
 *   @Get()
 *   async findAll(@Ctx() context: RequestContext) {
 *     return this.usersService.findAll(context);
 *   }
 * }
 * ```
 */
export const Ctx = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestContext => {
    const cls = ClsServiceManager.getClsService();
    return RequestContext.fromCls(cls);
  },
);

/**
 * Alias for @Ctx decorator
 */
export const ReqContext = Ctx;
