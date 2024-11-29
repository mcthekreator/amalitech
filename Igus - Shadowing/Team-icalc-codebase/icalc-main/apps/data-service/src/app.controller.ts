import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './modules/shared/decorators';

@ApiTags('health')
@Public()
@Controller()
export class AppController {
  @ApiOperation({ operationId: 'Health check' })
  @Get()
  public get(): string {
    return 'Data service running properly.';
  }

  @ApiOperation({ operationId: '__coverage__' })
  @Get('coverage')
  public getCoverage(): { coverage: unknown } {
    if (
      process.env.NX_TASK_TARGET_CONFIGURATION === 'production' ||
      process.env.NX_TASK_TARGET_CONFIGURATION === 'staging'
    ) {
      throw new NotFoundException();
    }
    return { coverage: global?.__coverage__ };
  }
}
