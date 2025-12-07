import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const url: string = request.url;

    // Legacy URL-based public routes
    if (
      url.startsWith('/api/v1') ||
      url.startsWith('/mcp/') ||
      url.startsWith('/sse') ||
      url.startsWith('/messages') ||
      url.startsWith('/health')
    ) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    context: ExecutionContext,
  ): TUser {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return user as TUser;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const url = request.url;

    // Legacy URL-based public routes
    if (
      url.startsWith('/api/v1') ||
      url.startsWith('/mcp/') ||
      url.startsWith('/sse') ||
      url.startsWith('/messages') ||
      url.startsWith('/health')
    ) {
      return user as TUser;
    }

    if (err || !user) {
      throw new UnauthorizedException(
        err instanceof Error ? err.message : 'Unauthorized',
      );
    }
    return user as TUser;
  }
}
