import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception && exception.status === 401) {
      return response.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json(exception.getResponse());
    }
    console.error(exception);
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
