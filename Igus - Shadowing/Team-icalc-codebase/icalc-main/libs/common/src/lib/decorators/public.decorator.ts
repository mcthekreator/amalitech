import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Public = (): CustomDecorator<string> => SetMetadata('isPublic', true);
