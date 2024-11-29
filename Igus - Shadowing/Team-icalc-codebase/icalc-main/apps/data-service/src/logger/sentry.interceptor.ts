import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { ContextType, HttpArgumentsHost, RpcArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import type { Scope } from '@sentry/node';
import { addRequestDataToEvent, captureException, withScope } from '@sentry/node';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SentryInterceptorOptions } from './sentry.declarations';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private readonly options?: SentryInterceptorOptions) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap({
        error: (exception: unknown) => {
          if (this.shouldReport(exception)) {
            withScope((scope) => this.captureException(context, scope, exception));
          }
        },
      })
    );
  }

  protected captureException(context: ExecutionContext, scope: Scope, exception: unknown): void {
    switch (context.getType<ContextType>()) {
      case 'http':
        return this.captureHttpException(scope, context.switchToHttp(), exception);
      case 'rpc':
        return this.captureRpcException(scope, context.switchToRpc(), exception);
      case 'ws':
        return this.captureWsException(scope, context.switchToWs(), exception);
      default:
        return this.captureHttpException(scope, context.switchToHttp(), exception);
    }
  }

  private captureHttpException(scope: Scope, http: HttpArgumentsHost, exception: unknown): void {
    const data = addRequestDataToEvent({}, http.getRequest(), this.options?.eventOptions);

    scope.setExtra('req', data.request);
    if (data.extra) {
      scope.setExtras(data.extra);
    }
    if (data.user) {
      scope.setUser(data.user);
    }

    captureException(exception);
  }

  private captureRpcException(scope: Scope, rpc: RpcArgumentsHost, exception: unknown): void {
    scope.setExtra('rpc_data', rpc.getData());
    captureException(exception);
  }

  private captureWsException(scope: Scope, ws: WsArgumentsHost, exception: unknown): void {
    scope.setExtra('ws_client', ws.getClient());
    scope.setExtra('ws_data', ws.getData());
    captureException(exception);
  }

  private shouldReport(exception: unknown): boolean {
    if (!this.options?.filters) {
      return true;
    }

    return this.options.filters.every(({ type, filter }) => {
      return !(exception instanceof type && (!filter || filter(exception)));
    });
  }
}
