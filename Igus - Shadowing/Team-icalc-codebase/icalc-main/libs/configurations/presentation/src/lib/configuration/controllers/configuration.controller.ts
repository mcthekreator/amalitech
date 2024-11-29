import { IcalcCalculationOperands, IcalcMetaDataFilter } from '@igus/icalc-domain';
import type {
  IcalcListInformation,
  FilterConfigurationResponseDto,
  Configuration,
  FindConfigurationResponseDto,
} from '@igus/icalc-domain';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindConfigurationByMatNumberDto } from '../dtos/find-configuration.dto';
import { ConfigurationService } from '@igus/icalc-configurations-application';
import { ConfigurationsPresentationMapperService } from './configuration-response-mapper.service';

@ApiTags('configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(
    private readonly configurationService: ConfigurationService,
    private configurationsPresentationMapperService: ConfigurationsPresentationMapperService
  ) {}

  @Get()
  public async getAllConfiguration(): Promise<Configuration[]> {
    return this.configurationService.getAllConfiguration();
  }

  @Get('findByNumber')
  public async findConfigurationByNumber(
    @Query() findConfigurationDto: FindConfigurationByMatNumberDto
  ): Promise<FindConfigurationResponseDto> {
    const result = await this.configurationService.findConfigurationByNumber(findConfigurationDto);

    return this.configurationsPresentationMapperService.mapToFindOneConfigurationResponseDto(result);
  }

  @Get('filterConfiguration')
  public async filterConfiguration(
    @Query() filter: IcalcMetaDataFilter,
    @Query() operands: IcalcCalculationOperands,
    @Query() listInformation: Partial<IcalcListInformation>
  ): Promise<FilterConfigurationResponseDto> {
    const result = await this.configurationService.filterConfiguration(filter, operands, listInformation);

    return this.configurationsPresentationMapperService.mapToFilterConfigurationResponseDto(result);
  }
}
