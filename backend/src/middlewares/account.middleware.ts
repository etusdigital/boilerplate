import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class AccountMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const account = req.header('account-id');
    const user = req.header('user');
    if (!account) {
      throw new HttpException('[Unauthorized] - Account not exists', HttpStatus.UNAUTHORIZED);
    }

    this.cls.set('accountId', account);
    this.cls.set('user', JSON.parse(user || '{"id": 1}'));
    this.cls.set('transactionId', uuidv7());

    next();
  }
}
