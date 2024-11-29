import { HttpStatus } from '@nestjs/common';
import { ApiNumericEnum } from '../docs';

export class ErrorResponse {
  @ApiNumericEnum(HttpStatus)
  public statusCode!: HttpStatus;

  public message!: string | string[];

  public error?: string;
}

export class UnauthorisedErrorResponse extends ErrorResponse {
  public statusCode = HttpStatus.UNAUTHORIZED;

  public message = 'Unauthorized';
}

export class NotFoundErrorResponse extends ErrorResponse {
  public statusCode = HttpStatus.NOT_FOUND;

  public message = 'Not found';
}

export class InternalServerErrorResponse extends ErrorResponse {
  public statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  public message = 'Internal server error';
}

export class ServiceUnavailableErrorResponse extends ErrorResponse {
  public statusCode = HttpStatus.SERVICE_UNAVAILABLE;

  public message = 'Service unavailable';
}
