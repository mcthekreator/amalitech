import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseIndexException extends HttpException {
  constructor() {
    super(
      { status: HttpStatus.NOT_FOUND, message: 'Entity with provided schema version does not exists' },
      HttpStatus.NOT_FOUND
    );
  }
}
