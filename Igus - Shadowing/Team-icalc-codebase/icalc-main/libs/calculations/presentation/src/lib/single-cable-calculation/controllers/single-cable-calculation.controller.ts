import type {
  CalculationConfigurationStatus,
  CheckForNewChainflexPricesResult,
  RemoveChainflexDataResponseDto,
  SaveSingleCableCalculationResponseDto,
  SingleCableCalculationPresentation,
  UpdateChainflexPricesResult,
} from '@igus/icalc-domain';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  SetCalculationConfigurationStatusToApprovedRequestDto,
  FindCalculationConfigurationStatusByIdsRequestDto,
} from '@igus/icalc-domain';
import { GetCurrentUserId } from '@igus/icalc-common';

import { SingleCableCalculationService, StatusService } from '@igus/icalc-calculations-application';
import { SaveSingleCableCalculationRequestDto } from '../dtos/save-single-cable-calculation-request.dto';
import { RemoveChainflexDataDto } from '../dtos/remove-chainflex-data-request.dto';
import { UpdateChainflexPricesDto } from '../dtos/update-chainflex-prices-request.dto';
import { CheckForNewChainflexPricesDto } from '../dtos/check-for-new-chainflex-prices-request.dto';
import { SingleCableCalculationResponseMapperService } from './single-cable-calculation-response-mapper.service';

@ApiTags('single-cable-calculation')
@Controller('single-cable-calculation')
export class SingleCableCalculationController {
  constructor(
    private readonly singleCableCalculationService: SingleCableCalculationService,
    private readonly singleCableCalculationResponseMapperService: SingleCableCalculationResponseMapperService,
    private readonly statusService: StatusService
  ) {}

  @Get()
  public async getOneSingleCableCalculation(
    @Query() q: { calculationId?: string; configurationId?: string; singleCableCalculationId: string }
  ): Promise<SingleCableCalculationPresentation> {
    const response = await this.singleCableCalculationService.getOne(q);

    return this.singleCableCalculationResponseMapperService.mapToGetOneSingleCableCalculationResponseDto(response);
  }

  @Post('saveSingleCableCalculation')
  public async saveSingleCableCalculation(
    @Body()
    calculationRequest: SaveSingleCableCalculationRequestDto,
    @GetCurrentUserId() userId: string
  ): Promise<SaveSingleCableCalculationResponseDto> {
    const { configuration, snapshot } = calculationRequest;
    const { batchSize, chainflexLength, id, commercialWorkStepOverrides } = calculationRequest;

    const { singleCableCalculation, calculationConfigurationStatus } =
      await this.singleCableCalculationService.saveSingleCableCalculation(
        userId,
        id,
        { chainflexLength, batchSize, commercialWorkStepOverrides },
        configuration,
        snapshot
      );

    return this.singleCableCalculationResponseMapperService.mapToSaveSingleCableCalculationResponseDto(
      singleCableCalculation,
      calculationConfigurationStatus
    );
  }

  // STATUS
  @Post('configuration/status/approve')
  public async approve(
    @GetCurrentUserId() userId: string,
    @Body() setCalculationConfigurationStatusToApprovedDto: SetCalculationConfigurationStatusToApprovedRequestDto
  ): Promise<CalculationConfigurationStatus> {
    return this.statusService.setCalculationConfigurationStatusToApproved(
      userId,
      setCalculationConfigurationStatusToApprovedDto
    );
  }

  @Get('configuration/status/findCalculationConfigurationStatusByIds')
  public async findCalculationConfigurationStatusByIds(
    @Body() findCalculationConfigurationStatusByIdsDto: FindCalculationConfigurationStatusByIdsRequestDto
  ): Promise<CalculationConfigurationStatus> {
    return this.statusService.findCalculationConfigurationStatusByIds(findCalculationConfigurationStatusByIdsDto);
  }

  @Post('checkChainflexAndPriceExistence')
  public async checkChainflexAndPriceExistence(
    @Body() checkForNewChainflexPricesRequestDto: CheckForNewChainflexPricesDto
  ): Promise<CheckForNewChainflexPricesResult> {
    return this.singleCableCalculationService.checkChainflexAndPriceExistence(
      checkForNewChainflexPricesRequestDto.singleCableCalculationIds
    );
  }

  @Post('updateChainflexPrices')
  public async updateChainflexPrices(
    @GetCurrentUserId() userId: string,
    @Body() updateChainflexPricesDto: UpdateChainflexPricesDto
  ): Promise<UpdateChainflexPricesResult> {
    return this.singleCableCalculationService.updateChainflexPrices(
      userId,
      updateChainflexPricesDto.singleCableCalculationIds
    );
  }

  @Post('removeChainflexData')
  public async removeChainflexData(
    @GetCurrentUserId() userId: string,
    @Body() removeChainflexDataDto: RemoveChainflexDataDto
  ): Promise<RemoveChainflexDataResponseDto> {
    const result = await this.singleCableCalculationService.removeChainflexData(
      userId,
      removeChainflexDataDto.singleCableCalculationIds
    );

    return this.singleCableCalculationResponseMapperService.mapToRemoveChainflexDataResponseDto(result);
  }
}
