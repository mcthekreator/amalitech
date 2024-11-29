import type { AkeneoItem, ChainflexAkeneo, ChainflexCable, IcalcLocale } from '@igus/icalc-domain';
import { CfItem } from '@igus/icalc-domain';
import { ArrayUtils } from '@igus/icalc-utils';
import { Injectable } from '@nestjs/common';
import { Logger } from '../../../logger';
import type { AxiosRequestConfig } from 'axios';
import axios, { AxiosError } from 'axios';

import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { catchError, firstValueFrom, map, Observable, of, retry, RetryConfig, switchMap, tap } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RESPONSE_TIMEOUT, RETRY_CONFIG } from '@igus/icalc-common';
export const akeneoSearchParam = {
  categories: [{ operator: 'IN CHILDREN', value: ['CF'] }],
  completeness: [{ operator: '=', value: 100, scope: 'ecommerce' }],
  enabled: [{ operator: '=', value: true }],
};

export interface ChainflexAPIRequestConfig {
  url: string;
  headers: { [key: string]: string };
  responseTimeout: number;
  retryConfig: RetryConfig;
  params: {
    search: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    with_count: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pagination_type: string;
    locales: string;
    attributes: string;
    limit: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    with_attribute_options: boolean;
  };
}

@Injectable()
export class AkeneoService {
  private startTimestamp: number;
  private authToken: string;

  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService
  ) {}

  public async authenticate(): Promise<string> {
    const postData = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      grant_type: 'password',
      username: getEnvironment().akeneoData.userName,
      password: getEnvironment().akeneoData.password,
    };

    const clientIDAndSecretBase64Encoded = Buffer.from(
      `${getEnvironment().akeneoData.clientId}:${getEnvironment().akeneoData.clientSecret}`
    ).toString('base64');
    const requestConfig = {
      timeout: getEnvironment().akeneoData.timeoutInMs,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Basic ${clientIDAndSecretBase64Encoded}`,
      },
    } as AxiosRequestConfig;
    const result = await axios
      .post(getEnvironment().akeneoData.authenticationUrl, postData, requestConfig)
      .then((response) => response?.data?.access_token)
      .catch((error) => {
        this.logger.error(
          `'Akeneo authentication request failed with code: ${error.code}`,
          'DataService - Akeneo Import'
        );
        return null;
      });

    if (result) {
      return 'Bearer ' + result;
    }
    return null;
  }

  public generateConductorAttributes(): string {
    const attributes = [];

    for (let index = 1; index < 62; index++) {
      attributes.push(`attr_conductor_number_${index < 10 ? '0' : ''}${index}`);
    }
    return attributes.join(',');
  }

  public getLocalizedProperty(item: AkeneoItem, propertyName: string, locale: IcalcLocale): string {
    return (
      ArrayUtils.fallBackToEmptyArray<{ locale: IcalcLocale; data: string }>(item.values?.[propertyName]).find(
        (element) => element.locale === locale
      )?.data || 'no data'
    );
  }

  public async fetchAllChainflexCables(authToken: string): Promise<AkeneoItem[]> {
    this.authToken = authToken;
    this.startTimestamp = new Date().getTime();
    const requestConfig = this.buildChainflexRequestConfig(authToken);

    this.logger.log(`Start fetching Chainflex data`, 'DataService - Akeneo Import');
    return firstValueFrom(
      this.fetchWhileHasNextPage(requestConfig.url).pipe(tap((fetchResults) => this.logFinalResults(fetchResults)))
    );
  }

  public processResults(results: AkeneoItem[]): ChainflexCable[] {
    let cfItemCount = 0;
    let noPartNumberCount = 0;
    let noConductorDataCount = 0;
    let invalidConductorDataCount = 0;
    let faultyItemsCount = 0;
    const result = results
      ?.filter((item) => !!item)
      .map((item) => {
        if (!item.values?.part_number) {
          return null;
        }
        // VALIDATION START
        const validationErrors: string[] = [];

        cfItemCount++;
        if (!item.values?.part_number) {
          noPartNumberCount++;
          validationErrors.push(`no part_number`);
        }
        if (!item.values?.attr_conductor_number_01) {
          noConductorDataCount++;
          validationErrors.push(`no conductor data`);
        }

        try {
          const itemAsCfItem = new CfItem(item);

          if (!itemAsCfItem.isValid()) {
            invalidConductorDataCount++;
          }

          faultyItemsCount = noConductorDataCount + invalidConductorDataCount;

          itemAsCfItem.getValidationErrorList().forEach((e) => {
            validationErrors.push(e);
          });

          const cableStructureInformation = {
            isValid: itemAsCfItem.isValid() && validationErrors.length === 0,
            structure: itemAsCfItem.getStructure(),
            validationErrors,
          };
          // VALIDATION END

          return {
            // partNumber / identifier
            partNumber: ArrayUtils.fallBackToEmptyArray(item.values?.part_number)[0]?.data || 'no data',
            // description
            description: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              en_US: this.getLocalizedProperty(item, 'article_description_text_area', 'en_US'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              de_DE: this.getLocalizedProperty(item, 'article_description_text_area', 'de_DE'),
            },
            // overallShield
            overallShield: ArrayUtils.fallBackToEmptyArray(item.values?.attr_shielding_boolean)[0]?.data || false,
            // outerJacket
            outerJacket: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              en_US:
                ArrayUtils.fallBackToEmptyArray(item.values?.attr_jacket_material)[0]?.linked_data.labels.en_US ||
                'no data',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              de_DE:
                ArrayUtils.fallBackToEmptyArray(item.values?.attr_jacket_material)[0]?.linked_data.labels.de_DE ||
                'no data',
            },
            // innerJacket
            innerJacket: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              en_US:
                ArrayUtils.fallBackToEmptyArray(item.values?.attr_inner_jacket_simple_select)[0]?.linked_data.labels
                  .en_US || 'no data',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              de_DE:
                ArrayUtils.fallBackToEmptyArray(item.values?.attr_inner_jacket_simple_select)[0]?.linked_data.labels
                  .de_DE || 'no data',
            },
            // numberOfCores
            numberOfCores:
              ArrayUtils.fallBackToEmptyArray(item.values?.attr_number_of_cores_text)[0]?.data || 'no data',
            // nominalCrossSection
            nominalCrossSection: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              en_US: this.getLocalizedProperty(item, 'nominal_cross_section_text_localized', 'en_US'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              de_DE: this.getLocalizedProperty(item, 'nominal_cross_section_text_localized', 'de_DE'),
            },
            // outerDiameter
            outerDiameter: {
              amount:
                parseFloat(
                  ArrayUtils.fallBackToEmptyArray(item.values?.attr_outer_diameter_max_metric_mm)[0]?.data?.amount
                ) || null,
              unit:
                ArrayUtils.fallBackToEmptyArray(item.values?.attr_outer_diameter_max_metric_mm)[0]?.data?.unit ||
                'no data',
            },
            // cableStructure
            cableStructure: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              en_US:
                ArrayUtils.fallBackToEmptyArray(
                  item.values?.attr_number_of_cores_and_conductor_nominal_cross_section_simple_select
                )[0]?.linked_data.labels.en_US || 'no data',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              de_DE:
                ArrayUtils.fallBackToEmptyArray(
                  item.values?.attr_number_of_cores_and_conductor_nominal_cross_section_simple_select
                )[0]?.linked_data.labels.de_DE || 'no data',
            },
            // shopImageUrl
            shopImageUrl: ArrayUtils.fallBackToEmptyArray(item.values?.webshop_URL_picture)[0]?.data || 'no data',
            // UL
            ul: ArrayUtils.fallBackToEmptyArray(item.values?.attr_ul_csa_boolean)[0]?.data || false,
            // CableStructureInformation
            cableStructureInformation,
          } as ChainflexCable;
        } catch (e: unknown) {
          this.logger.error((e as Error).message, null, 'DataService - Validation');
        }
      })
      .filter((item) => item !== null);

    this.logger.log(
      `[VALIDATION-SUMMARY]: no part number = ${noPartNumberCount}/${cfItemCount}, no conductor data = ${noConductorDataCount}/${cfItemCount}, items with invalid conductors = ${invalidConductorDataCount}/${cfItemCount}, faulty items overall = ${faultyItemsCount}/${cfItemCount}`,
      'DataService - Akeneo Items Info'
    );

    return result;
  }

  private fetchWhileHasNextPage(url: string): Observable<AkeneoItem[]> {
    const requestConfig = this.buildChainflexRequestConfig(this.authToken);

    const {
      responseTimeout,
      retryConfig: { count: retryCount, delay: retryDelay },
    } = requestConfig;

    return this.httpService
      .get<ChainflexAkeneo>(url, {
        headers: requestConfig.headers,
        timeout: responseTimeout,
        params: requestConfig.params,
      })
      .pipe(
        map((httpResponse) => httpResponse.data),
        switchMap((responsePayload: ChainflexAkeneo) => {
          if (responsePayload._links.next) {
            return this.fetchNextPage(responsePayload._links.next.href as string, responsePayload._embedded.items);
          }
          return of(responsePayload._embedded.items);
        }),
        catchError((err: unknown) => this.logAndRethrowError(err)),
        retry({ delay: retryDelay, count: retryCount })
      );
  }

  private fetchNextPage(nextPageUrl: string, currentPageData: AkeneoItem[]): Observable<AkeneoItem[]> {
    this.logger.log('Requesting chainflex items from Akeneo...', 'DataService - Akeneo Import');

    return this.fetchWhileHasNextPage(nextPageUrl).pipe(
      map((nextPageData: AkeneoItem[]) => currentPageData.concat(nextPageData))
    );
  }

  private buildChainflexRequestConfig(authToken: string): ChainflexAPIRequestConfig {
    const params = {
      search: JSON.stringify(akeneoSearchParam),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      with_count: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      pagination_type: 'search_after',
      locales: 'en_US,de_DE',
      attributes: `part_number,article_description_text_area,attr_shielding_boolean,attr_jacket_material,attr_inner_jacket_simple_select,attr_number_of_cores_text,nominal_cross_section_text_localized,attr_outer_diameter_max_metric_mm,attr_number_of_cores_and_conductor_nominal_cross_section_simple_select,webshop_URL_picture,attr_ul_csa_boolean,${this.generateConductorAttributes()}`,
      limit: 100,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      with_attribute_options: true,
    };

    const headers = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: authToken,
    };

    const url = getEnvironment().akeneoData?.productsUrl;

    return { params, headers, url, responseTimeout: RESPONSE_TIMEOUT, retryConfig: RETRY_CONFIG };
  }

  private computeFetchingDurationInSeconds(end: number): number {
    return (end - this.startTimestamp) / 1000;
  }

  private logFinalResults(results: unknown[]): void {
    const fetchingDurationInSeconds = this.computeFetchingDurationInSeconds(new Date().getTime());

    this.logger.log(
      `Fetched ${results.length} items. It took ${fetchingDurationInSeconds} seconds.`,
      'DataService - Akeneo Items Info'
    );
  }

  private logAndRethrowError(error: unknown): never {
    const message =
      error instanceof AxiosError ? `${error.message} at ${error.config.url}` : 'Unexpected Network Error';

    this.logger.error(message);
    throw error;
  }
}
