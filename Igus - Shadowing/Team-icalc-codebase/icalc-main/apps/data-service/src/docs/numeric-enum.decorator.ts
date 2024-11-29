import { ApiProperty } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
export const ApiNumericEnum = (entity: any[] | Record<string, any>): PropertyDecorator => {
  return ApiProperty({ enum: Object.values(entity).filter((value) => typeof value === 'number') });
};
