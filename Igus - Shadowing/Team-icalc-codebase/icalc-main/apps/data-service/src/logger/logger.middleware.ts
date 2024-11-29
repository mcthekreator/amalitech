import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    const contextString = 'DataService - Request';
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log(`${method} ${statusCode} ${originalUrl} - ${userAgent}`, contextString);
      this.logger.verbose(`Body: ${JSON.stringify(req.body, null, 2)}`, contextString);
    });

    next();
  }
}
