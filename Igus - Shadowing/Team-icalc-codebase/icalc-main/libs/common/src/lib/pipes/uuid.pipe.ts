import type { PipeTransform } from '@nestjs/common';
import { Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class UuidPipe implements PipeTransform<string> {
  public async transform(value: string): Promise<string> {
    if (!isUUID(value)) {
      throw new BadRequestException('Given string is not a UUID');
    }
    return value;
  }
}
