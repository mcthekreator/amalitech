import type { ChainflexAkeneo } from '@igus/icalc-domain';
import { CfItem } from '@igus/icalc-domain';
import { Injectable } from '@nestjs/common';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import axios from 'axios';

import { Logger } from '../../../logger';
import { ChainflexService } from '../../chainflex/application';
import { AkeneoService, akeneoSearchParam } from './akeneo.service';

@Injectable()
export class ValidationService {
  private authToken: string;

  constructor(
    private readonly chainflexService: ChainflexService,
    private readonly logger: Logger,
    private readonly akeneoService: AkeneoService
  ) {}

  public async authenticateAndValidateAkeneoData(): Promise<string[]> {
    const authentication = await this.akeneoService.authenticate();

    if (authentication) {
      this.authToken = authentication;
      this.logger.log('Akeneo authentication successful.', 'DataService - Validation');
      return this.fetchAndValidateChainflexCableStructure();
    }
  }

  private async fetchAndValidateChainflexCableStructure(): Promise<string[]> {
    const headers = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: this.authToken,
    };

    const params = {
      search: JSON.stringify(akeneoSearchParam),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      with_count: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      pagination_type: 'search_after',
      locales: 'en_US,de_DE',
      attributes: `part_number,${this.akeneoService.generateConductorAttributes()}`,
      limit: 100,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      with_attribute_options: true,
    };

    const firstPage = (await axios.get(getEnvironment().akeneoData?.productsUrl, {
      headers,
      params,
    })) as { data: ChainflexAkeneo };

    let results = firstPage?.data?._embedded?.items;
    let nextPageUrl = firstPage?.data?._links?.next?.href || null;

    while (nextPageUrl) {
      // eslint-disable-next-line no-await-in-loop
      const nextPage = (await axios.get(nextPageUrl, {
        headers,
      })) as { data: ChainflexAkeneo };

      nextPageUrl = nextPage?.data?._links?.next?.href;
      // eslint-disable-next-line no-unsafe-optional-chaining
      results = [...results, ...nextPage?.data?._embedded?.items];
      this.logger.log('Requesting chainflex items from Akeneo...', 'DataService - Validation');
    }
    this.logger.log(`Fetched ${results.length} chainflex items from Akeneo.`, 'DataService - Validation');

    let cfItemCount = 0;
    let noPartNumberCount = 0;
    let noConductorDataCount = 0;
    let invalidConductorsCount = 0;

    const validationErrors: string[] = [];

    results
      .filter((item) => !!item)
      .forEach((item) => {
        const individualValidationErrors: string[] = [];

        cfItemCount++;
        if (!item.values?.part_number) {
          noPartNumberCount++;
          validationErrors.push(`[ ${item.identifier} ]: no part_number`);
          individualValidationErrors.push(`no part_number`);
        }
        if (!item.values?.attr_conductor_number_01) {
          noConductorDataCount++;
          validationErrors.push(`[ ${item.identifier} ]: no conductor data`);
          individualValidationErrors.push(`no conductor data`);
        }

        try {
          const itemAsCfItem = new CfItem(item);

          if (!itemAsCfItem.isValid()) {
            invalidConductorsCount++;
          }

          itemAsCfItem.getValidationErrorList().forEach((e) => {
            validationErrors.push(`[ ${itemAsCfItem.partNumber} ]:` + e);
            individualValidationErrors.push(e);
          });

          const cableStructureInformation = {
            isValid: itemAsCfItem.isValid() && individualValidationErrors.length === 0,
            structure: itemAsCfItem.getStructure(),
            validationErrors: individualValidationErrors,
          };

          this.chainflexService.addCableStructureInformationToChainflexItem(
            itemAsCfItem.partNumber,
            cableStructureInformation
          );
        } catch (e: unknown) {
          this.logger.error((e as Error).message, null, 'DataService - Validation');
        }
      });

    const faultyItemsCount = noConductorDataCount + invalidConductorsCount;

    this.logger.log(
      `[VALIDATION-SUMMARY]: no part number = ${noPartNumberCount}/${cfItemCount}, no conductor data = ${noConductorDataCount}/${cfItemCount}, items with invalid conductors = ${invalidConductorsCount}/${cfItemCount}, faulty items overall = ${faultyItemsCount}/${cfItemCount}`,
      'DataService - Validation'
    );
    validationErrors.splice(
      0,
      0,
      `[ VALIDATION-SUMMARY ]: no part number = ${noPartNumberCount}/${cfItemCount}, no conductor data = ${noConductorDataCount}/${cfItemCount}, items with invalid conductors = ${invalidConductorsCount}/${cfItemCount}, faulty items overall = ${faultyItemsCount}/${cfItemCount}`
    );

    return validationErrors;
  }
}
