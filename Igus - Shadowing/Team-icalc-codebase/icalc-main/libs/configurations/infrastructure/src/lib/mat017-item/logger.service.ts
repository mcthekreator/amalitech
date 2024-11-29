import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Mat017InfrastructureModuleLogger extends ConsoleLogger {}
