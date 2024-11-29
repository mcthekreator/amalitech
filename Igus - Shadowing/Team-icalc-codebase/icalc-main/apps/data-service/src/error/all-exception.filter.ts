import { Env } from '@igus/kopla-data';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { Logger } from '../logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const contextString = 'DataService - Exception';

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let details: Record<string, unknown>;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      details =
        typeof errorResponse === 'object' ? (errorResponse as Record<string, unknown>) : { message: errorResponse };
      stack = exception.stack;
    } else if (exception instanceof Error) {
      details = { message: exception.message };
      stack = exception.stack;
    } else if (typeof exception === 'string') {
      details = { message: exception };
    } else {
      try {
        details = { message: JSON.stringify(exception) };
      } catch (e: unknown) {
        details = { message: 'Unknown exception' };
      }
    }

    const errorResponseObject = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...details,
      ...(getEnvironment().env === Env.development ? { stack } : {}),
    };

    this.logger.error(
      `Path: ${errorResponseObject.path}, Status: ${errorResponseObject.statusCode}, Timestamp: ${errorResponseObject.timestamp}`,
      stack,
      contextString
    );

    response.status(status).json(errorResponseObject);
  }
}



