import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Observable, RetryConfig } from 'rxjs';
import { catchError, firstValueFrom, map, of, retry, switchMap, tap } from 'rxjs';

import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { Mat017InfrastructureModuleLogger } from './logger.service';
import { AxiosError } from 'axios';
import type { IerpMat017Item, IerpMat017ItemUsage, IerpPaginatedResult } from '@igus/icalc-domain';

export interface Mat017ItemIerpServiceConfig {
  retryCount: number;
  retryDelay: number;
  responseTimeout: number;
}

@Injectable()
export class Mat017ItemIerpService {
  private readonly apiRessources = {
    mat017ItemsUsages: 'Mat017/UsagesList',
    mat017Items: 'Mat017/list',
    mat017Item: 'Mat017',
  };

  private retryConfig: RetryConfig = {
    count: 3,
    delay: 10000,
  };

  private responseTimeout = 120000;

  private headers = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Ocp-Apim-Subscription-Key': getEnvironment().ierp.subscriptionKey,
  };

  private startTimestamp: number;
  constructor(
    private httpService: HttpService,
    private logger: Mat017InfrastructureModuleLogger
  ) {
    this.logger.setContext('Mat017ItemIerpService');
  }

  public setConfig(config: Partial<Mat017ItemIerpServiceConfig>): void {
    this.responseTimeout = config.responseTimeout || this.responseTimeout;
    this.retryConfig.count = config.retryCount || this.retryConfig.count;
    this.retryConfig.delay = config.retryDelay || this.retryConfig.delay;
  }

  public getConfig(): Mat017ItemIerpServiceConfig {
    return {
      responseTimeout: this.responseTimeout,
      retryCount: this.retryConfig.count,
      retryDelay: this.retryConfig.delay as number,
    };
  }

  public getMat017Item(matNumber: string): Promise<IerpMat017Item> {
    const { responseTimeout, retryCount, retryDelay } = this.getConfig();

    const url = this.getMat017ItemUrl(matNumber);

    this.logger.log(`Start fetching Mat017Item at ${url}`);
    return firstValueFrom(
      this.httpService
        .get<IerpMat017Item>(this.getMat017ItemUrl(matNumber), {
          headers: this.headers,
          timeout: responseTimeout,
        })
        .pipe(
          map((response) => response.data),
          tap((mat017Item) => this.logger.log(`Fetched ${matNumber} \n ${JSON.stringify(mat017Item)}`)),
          catchError((err: unknown) => this.logAndRethrowError(err)),
          retry({ delay: retryDelay, count: retryCount })
        )
    );
  }

  public getAllMat017Items(pageSize?: number): Promise<IerpMat017Item[]> {
    this.startTimestamp = new Date().getTime();
    const firstPageUrl = this.getMat017ItemsUrl(pageSize);

    this.logger.log(`Start fetching Mat017Items at ${firstPageUrl}`);

    return firstValueFrom(
      this.fetchWhileHasNextPage<IerpMat017Item>(firstPageUrl).pipe(tap((results) => this.logFinalResults(results)))
    );
  }

  public getAllMat017ItemsUsages(pageSize?: number): Promise<IerpMat017ItemUsage[]> {
    this.startTimestamp = new Date().getTime();
    const firstPageUrl = this.getUsagesUrl(pageSize);

    this.logger.log(`Start fetching Mat017ItemsUsages at ${firstPageUrl}`);
    return firstValueFrom(
      this.fetchWhileHasNextPage<IerpMat017ItemUsage>(firstPageUrl).pipe(
        tap((results) => this.logFinalResults(results))
      )
    );
  }

  private fetchWhileHasNextPage<T>(url: string): Observable<T[]> {
    const { responseTimeout, retryCount, retryDelay } = this.getConfig();

    return this.httpService
      .get<IerpPaginatedResult<T>>(url, {
        headers: this.headers,
        timeout: responseTimeout,
      })
      .pipe(
        map((httpResponse) => httpResponse.data),
        switchMap((responsePayload: IerpPaginatedResult<T>) => {
          if (responsePayload.nextPage) {
            return this.fetchNextPage(responsePayload.nextPage, responsePayload.data);
          }

          return of(responsePayload.data);
        }),
        catchError((err: unknown) => this.logAndRethrowError(err)),
        retry({ delay: retryDelay, count: retryCount })
      );
  }

  private fetchNextPage<T>(nextPageUrl: string, currentPageData: T[]): Observable<T[]> {
    const fetchedItemType = nextPageUrl.includes('Usages') ? 'Mat017ItemUsages' : 'Mat017Items';

    this.logger.log(`Fetching ${fetchedItemType} from ${nextPageUrl}`);
    return this.fetchWhileHasNextPage(nextPageUrl).pipe(
      map((nextPageData: T[]) => currentPageData.concat(nextPageData))
    );
  }

  private logAndRethrowError(error: unknown): never {
    let message = 'Unexpected Network Error';

    if (error instanceof AxiosError) {
      message = `${error.message} at ${error.config.url}`;
    }

    this.logger.error(message);
    throw error;
  }

  private logFinalResults(results: unknown[]): void {
    const fetchingDurationInSeconds = this.computeFetchingDurationInSeconds(new Date().getTime());

    this.logger.log(`Fetched ${results.length} items. It took ${fetchingDurationInSeconds} seconds.`);
  }

  private getMat017ItemUrl(matNumber: string): string {
    return this.buildIerpUrl(`${this.apiRessources.mat017Item}/${matNumber}`);
  }

  private getUsagesUrl(pageSize?: number): string {
    return this.buildIerpUrl(this.apiRessources.mat017ItemsUsages, pageSize);
  }

  private getMat017ItemsUrl(pageSize?: number): string {
    return this.buildIerpUrl(this.apiRessources.mat017Items, pageSize);
  }

  private computeFetchingDurationInSeconds(end: number): number {
    return (end - this.startTimestamp) / 1000;
  }

  private buildIerpUrl(ressource: string, pageSize?: number): string {
    const url = new URL(`${getEnvironment().ierp.hostname}/${getEnvironment().ierp.namespace}/${ressource}`);

    if (pageSize) {
      url.searchParams.set('pageSize', pageSize.toString());
    }

    return url.href;
  }
}
