import type {
  Calculation,
  IcalcListInformation,
  UpdateCalculationWithSCC,
  FilterCalculationResponseDto,
  FindCalculationByIdResponseDto,
  CreateCalculationAndConfigurationResponseDto,
  CopyConfigurationToNewCalculationResponseDto,
  CopyConfigurationToExistingCalculationResponseDto,
  AssignConfigurationToExistingCalculationResponseDto,
  AssignConfigurationItemsToCopiedCalculationResponseDto,
  SetExcelDownloadFlagsForCalculationResponseDto,
  RemoveLinkBetweenConfigurationAndCalculationResponseDto,
  CreateNewConfigurationForExistingCalculationResponseDto,
  CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto,
  UpdateMat017ItemsOverridesInConfigurationsResponseDto,
  HaveMat017ItemsOverridesChangedResponseDto,
  RemoveMat017ItemsResponseDto,
} from '@igus/icalc-domain';
import {
  IcalcCalculationOperands,
  IcalcMetaDataFilter,
  HaveMat017ItemsOverridesChangedRequestDto,
} from '@igus/icalc-domain';
import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetCurrentUserId } from '@igus/icalc-common';
import {
  AssignConfigurationItemsToCopiedCalculationDto,
  CopyConfigurationToNewCalculationDto,
  CreateCalculationAndConfigurationDto,
  CreateNewConfigurationForExistingCalculationDto,
} from '../dtos/create-calculation-and-configuration.dto';
import { CopyConfigurationToExistingCalculationDto } from '../dtos/copy-configuration-to-existing-calculation.dto';
import { FindCalculationByCalculationNumberDto, FindCalculationByIdDto } from '../dtos/find-calculation.dto';
import { UpdateCalculationDto } from '../dtos/update-calculation.dto';
import { CalculationService } from '@igus/icalc-calculations-application';
import { mapToFilterCalculationResponseDto } from '../dtos/filter-calculation-response.dto';
import { AssignConfigurationToExistingCalculationDto } from '../dtos/assign-configuration-to-existing-calculation.dto';
import {
  SetExcelDownloadFlagsForCalculationDto,
  RemoveLinkBetweenConfigurationAndCalculationDto,
  UpdateMat017OverridesDto,
} from '../dtos';
import { CanLinkBetweenConfigurationAndCalculationBeRemovedDto } from '../dtos/can-link-between-configuration-and-calculation-be-removed.dto';
import { CalculationResponseMappersService } from './calculation-response-mappers.service';
import { RemoveMat017ItemsDto } from '../dtos/remove-mat017-items.dto';

@ApiTags('calculation')
@Controller('calculation')
export class CalculationController {
  constructor(
    private readonly calculationService: CalculationService,
    private readonly calculationResponseMappersService: CalculationResponseMappersService
  ) {}

  @Post('copyConfigurationToExistingCalculation')
  public async copyConfigurationToExistingCalculation(
    @Body() copyConfigurationToExistingCalculationDto: CopyConfigurationToExistingCalculationDto,
    @GetCurrentUserId() userId: string
  ): Promise<CopyConfigurationToExistingCalculationResponseDto> {
    const result = await this.calculationService.copyConfigurationToExistingCalculation(
      copyConfigurationToExistingCalculationDto,
      userId
    );

    return this.calculationResponseMappersService.mapToCopyConfigurationToExistingCalculationResponseDto(result);
  }

  @Post('copyConfigurationToNewCalculation')
  public async copyConfigurationToNewCalculation(
    @Body() copyConfigurationToNewCalculation: CopyConfigurationToNewCalculationDto,
    @GetCurrentUserId() userId: string
  ): Promise<CopyConfigurationToNewCalculationResponseDto> {
    const result = await this.calculationService.copyConfigurationToNewCalculation(
      copyConfigurationToNewCalculation,
      userId
    );

    return this.calculationResponseMappersService.mapToCopyConfigurationToNewCalculationResponseDto(result);
  }

  @Post('assignConfigurationItemsToCopiedCalculation')
  public async assignConfigurationItemsToCopiedCalculation(
    @Body() assignConfigurationItemsToCopiedCalculationDto: AssignConfigurationItemsToCopiedCalculationDto,
    @GetCurrentUserId() userId: string
  ): Promise<AssignConfigurationItemsToCopiedCalculationResponseDto> {
    const result = await this.calculationService.assignConfigurationItemsToCopiedCalculationDto(
      assignConfigurationItemsToCopiedCalculationDto,
      userId
    );

    return this.calculationResponseMappersService.mapToAssignConfigurationItemsToCopiedCalculationResponseDto(result);
  }

  @Post('createNewConfigurationForExistingCalculation')
  public async createNewConfigurationForExistingCalculation(
    @Body() createNewConfigurationForExistingCalculationDto: CreateNewConfigurationForExistingCalculationDto,
    @GetCurrentUserId() userId: string
  ): Promise<CreateNewConfigurationForExistingCalculationResponseDto> {
    const result = await this.calculationService.createNewConfigurationForExistingCalculation(
      createNewConfigurationForExistingCalculationDto,
      userId
    );

    return this.calculationResponseMappersService.mapToCreateNewConfigurationForExistingCalculationResponseDto(result);
  }

  @Post('assignConfigurationToExistingCalculation')
  public async assignConfigurationToExistingCalculation(
    @Body() assignConfigurationToExistingCalculationDto: AssignConfigurationToExistingCalculationDto,
    @GetCurrentUserId() userId: string
  ): Promise<AssignConfigurationToExistingCalculationResponseDto> {
    const result = await this.calculationService.assignConfigurationToExistingCalculation(
      assignConfigurationToExistingCalculationDto,
      userId
    );

    return this.calculationResponseMappersService.mapToAssignConfigurationItemsToCopiedCalculationResponseDto(result);
  }

  @Post('removeLinkBetweenConfigurationAndCalculation')
  public async removeLinkBetweenConfigurationAndCalculation(
    @Body() removeLinkBetweenConfigurationAndCalculationDto: RemoveLinkBetweenConfigurationAndCalculationDto,
    @GetCurrentUserId() userId: string
  ): Promise<RemoveLinkBetweenConfigurationAndCalculationResponseDto> {
    const singleCableCalculation = await this.calculationService.removeLinkBetweenConfigurationAndCalculation(
      removeLinkBetweenConfigurationAndCalculationDto,
      userId
    );

    return this.calculationResponseMappersService.mapToRemoveLinkBetweenConfigurationAndCalculationResponseDto(
      singleCableCalculation
    );
  }

  @Post('canLinkBetweenConfigurationAndCalculationBeRemoved')
  public async canLinkBetweenConfigurationAndCalculationBeRemoved(
    @Body()
    canLinkBetweenConfigurationAndCalculationBeRemovedDto: CanLinkBetweenConfigurationAndCalculationBeRemovedDto
  ): Promise<CanLinkBetweenConfigurationAndCalculationBeRemovedResponseDto> {
    return this.calculationService.canLinkBetweenConfigurationAndCalculationBeRemoved(
      canLinkBetweenConfigurationAndCalculationBeRemovedDto
    );
  }

  @Post('createCalculationAndConfiguration')
  public async createCalculationAndConfiguration(
    @Body() createCalculationAndConfigurationDto: CreateCalculationAndConfigurationDto,
    @GetCurrentUserId() userId: string
  ): Promise<CreateCalculationAndConfigurationResponseDto> {
    const result = await this.calculationService.createCalculationAndConfiguration(
      createCalculationAndConfigurationDto,
      userId
    );

    return this.calculationResponseMappersService.mapToCreateCalculationAndConfigurationResponseDto(result);
  }

  @Patch()
  public async updateCalculation(
    @Body() updateCalculationDto: UpdateCalculationDto,
    @GetCurrentUserId() userId: string
  ): Promise<UpdateCalculationWithSCC> {
    const updatedCalculation: Partial<Calculation> = await this.calculationService.updateCalculation(
      updateCalculationDto,
      userId
    );

    return this.calculationResponseMappersService.mapToUpdateCalculationResponseDto(updatedCalculation);
  }

  @Patch('setExcelDownloadFlags')
  public async setExcelDownloadFlagsForCalculation(
    @Body() setExcelDownloadFlagsForCalculationDto: SetExcelDownloadFlagsForCalculationDto,
    @GetCurrentUserId() userId: string
  ): Promise<SetExcelDownloadFlagsForCalculationResponseDto> {
    const updatedCalculation: Partial<Calculation> = await this.calculationService.setExcelDownloadFlagsForCalculation(
      setExcelDownloadFlagsForCalculationDto,
      userId
    );

    return this.calculationResponseMappersService.mapToSetExcelDownloadFlagsForCalculationResponseDto(
      updatedCalculation
    );
  }

  @Get()
  public async getAllCalculations(): Promise<Calculation[]> {
    return this.calculationService.getAllCalculations();
  }

  @Get('findByNumber')
  public async findCalculationByNumber(
    @Query() findCalculationDto: FindCalculationByCalculationNumberDto
  ): Promise<Calculation> {
    return this.calculationService.findCalculationByNumber(findCalculationDto);
  }

  @Get('findById')
  public async findCalculationById(
    @Query() findCalculationByIdDto: FindCalculationByIdDto
  ): Promise<FindCalculationByIdResponseDto> {
    const result = await this.calculationService.findCalculationById(findCalculationByIdDto);

    return this.calculationResponseMappersService.mapToFindCalculationByIdResponseDto(result);
  }

  @Get('filter')
  public async filterCalculations(
    @Query() filter: IcalcMetaDataFilter,
    @Query() operands: IcalcCalculationOperands,
    @Query() listInformation: Partial<IcalcListInformation>
  ): Promise<FilterCalculationResponseDto> {
    const result = await this.calculationService.filterCalculations(filter, operands, listInformation);

    return mapToFilterCalculationResponseDto(result);
  }

  @Post('haveMat017ItemsOverridesChanged')
  public async haveMat017ItemsOverridesChanged(
    @Body() haveMat017ItemsOverridesChangedRequestDto: HaveMat017ItemsOverridesChangedRequestDto
  ): Promise<HaveMat017ItemsOverridesChangedResponseDto> {
    return this.calculationService.haveMat017ItemsOverridesChanged(haveMat017ItemsOverridesChangedRequestDto);
  }

  @Patch('updateMat017ItemsOverrides')
  public async updateMat017OverridesInConfigurations(
    @Body() updateOverridesDto: UpdateMat017OverridesDto,
    @GetCurrentUserId() userId: string
  ): Promise<UpdateMat017ItemsOverridesInConfigurationsResponseDto> {
    const { configurations, mat017ItemBaseDataMap, resetApprovalResultMap, configurationsWithRemovedOverridesMap } =
      await this.calculationService.updateMat017ItemsOverridesInManyConfigurations(updateOverridesDto, userId);

    return this.calculationResponseMappersService.mapToUpdateMat017ItemOverridesInConfigurationsResponseDto(
      configurations,
      mat017ItemBaseDataMap,
      resetApprovalResultMap,
      configurationsWithRemovedOverridesMap
    );
  }

  @Patch('removeMat017Items')
  public async removeMat017Items(
    @Body() removeMat07ItemsDto: RemoveMat017ItemsDto,
    @GetCurrentUserId() userId: string
  ): Promise<RemoveMat017ItemsResponseDto> {
    const { configurations, mat017ItemBaseDataMap, resetApprovalResultMap, configurationsWithRemovedOverrides } =
      await this.calculationService.removeMat017ItemsInManyConfigurations(removeMat07ItemsDto, userId);

    return this.calculationResponseMappersService.mapToRemoveMat017ItemsResponseDto(
      configurations,
      mat017ItemBaseDataMap,
      resetApprovalResultMap,
      configurationsWithRemovedOverrides
    );
  }
}
