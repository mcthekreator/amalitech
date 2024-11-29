import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class FavoritesInfrastructureModuleLogger extends ConsoleLogger {}
