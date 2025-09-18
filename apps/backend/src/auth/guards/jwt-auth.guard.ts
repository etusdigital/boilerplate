import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const url: string = request.url;

    if (url.startsWith('/api/v1') || url.startsWith('/mcp/') || url.startsWith('/sse') || url.startsWith('/messages')) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, _info: any, context: ExecutionContext): TUser {
    const request = context.switchToHttp().getRequest<Request>();
    const url = request.url;

    if (url.startsWith('/api/v1') || url.startsWith('/mcp/') || url.startsWith('/sse') || url.startsWith('/messages')) {
      return user as TUser;
    }

    if (err || !user) {
      throw new UnauthorizedException(err instanceof Error ? err.message : 'Unauthorized');
    }
    return user as TUser;
  }
}
