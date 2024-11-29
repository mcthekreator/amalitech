import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import type { AxiosResponse } from 'axios';
import axios from 'axios';

import { Logger } from '../../../logger';
import { AkeneoService, akeneoSearchParam } from '../services/akeneo.service';
import { ValidationService } from '../services/validation.service';

@ApiTags('akeneo')
@Controller('akeneo')
export class AkeneoController {
  constructor(
    private readonly validationService: ValidationService,
    private readonly logger: Logger,
    private readonly akeneoService: AkeneoService
  ) {}

  @Get('validate')
  public getValidation(): Promise<string[]> {
    return this.validationService.authenticateAndValidateAkeneoData();
  }

  @Get('first-page')
  public async firstPage(): Promise<AxiosResponse<unknown, unknown>> {
    const authenticationToken = await this.akeneoService.authenticate();

    if (!authenticationToken) {
      this.logger.error('Akeneo authentication failed.', 'DataService - Akeneo Import');
      return null;
    }
    this.logger.log('Akeneo authentication successful.', 'DataService - Akeneo Import');

    const headers = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: authenticationToken,
    };
    const params = {
      search: JSON.stringify(akeneoSearchParam),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      with_count: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      pagination_type: 'search_after',
      locales: 'en_US,de_DE',
      attributes: `part_number,article_description_text_area,attr_shielding_boolean,attr_jacket_material,attr_inner_jacket_simple_select,attr_number_of_cores_text,nominal_cross_section_text_localized,attr_outer_diameter_max_metric_mm,attr_number_of_cores_and_conductor_nominal_cross_section_simple_select,webshop_URL_picture,attr_ul_csa_boolean,${this.akeneoService.generateConductorAttributes()}`,
      limit: 100,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      with_attribute_options: true,
    };

    return axios
      .get(getEnvironment().akeneoData?.productsUrl, {
        headers,
        timeout: getEnvironment().akeneoData.timeoutInMs,
        params,
      })
      .then((response) => {
        return response;
      });
  }
}
