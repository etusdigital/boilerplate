import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { v7 as uuidv7 } from 'uuid';
import { ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/modules/users/users.service';
import { Auth0TokenPayload } from 'src/auth/auth0.interface';

dotenv.config();

@Injectable()
export class AccountMiddleware implements NestMiddleware {
  constructor(
    private readonly cls: ClsService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const account = req.header('account-id');
    if (!account) {
      throw new HttpException(
        '[Unauthorized] - Account not exists',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    const token = tokenExtractor(req);
    if (!token) {
      throw new HttpException(
        '[Unauthorized] - Token not exists',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const decodedToken = jwt.decode(token) as Auth0TokenPayload;
    if (!decodedToken) {
      throw new HttpException(
        '[Unauthorized] - Invalid token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.findByProviderId(decodedToken.sub);

    if (!user) {
      throw new HttpException(
        '[Unauthorized] - Account not exists',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.cls.set('accountId', account);
    this.cls.set('user', { ...user, userAccounts: null });
    this.cls.set('transactionId', uuidv7());
    this.cls.set('ip', req.ip);
    this.cls.set('userAgent', req.header('user-agent'));

    next();
  }
}
