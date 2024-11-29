import type {
  Calculation,
  CalculationConfigurationStatus,
  IcalcCalculationOperands,
  IcalcListInformation,
  IcalcListResult,
  IcalcMetaDataFilter,
  Configuration,
  SingleCableCalculation,
  AssignConfigurationItemsToCopiedCalculationRequestDto,
  CopyConfigurationToNewCalculationRequestDto,
  CreateCalculationAndConfigurationRequestDto,
  CreateNewConfigurationForExistingCalculationRequestDto,
  FindCalculationByCalculationNumberRequestDto,
  FindCalculationByIdRequestDto,
  UpdateCalculationRequestDto,
  AssignConfigurationToExistingCalculationRequestDto,
  RemoveLinkBetweenConfigurationAndCalculationRequestDto,
  SetCalculationConfigurationStatusToApprovedRequestDto,
  CopyConfigurationToExistingCalculationRequestDto,
  SetExcelDownloadFlagsForCalculationRequestDto,
  IcalcUser,
  CanLinkBetweenConfigurationAndCalculationBeRemovedRequestDto,
  UpdateMat017OverridesRequestDto,
  CalculationConfigurationApprovalStatusByConfigurationId,
  HaveMat017ItemsOverridesChangedRequestDto,
  HaveMat017ItemsOverridesChangedResponseDto,
  Mat017ItemsBaseDataMap,
  RemoveMat017ItemsRequestDto,
  RemoveMat017ItemsInManyConfigurationsResult,
  ConfigurationsWithRemovedOverridesMap,
} from '@igus/icalc-domain';
import {
  CalculationStatus,
  UserMapper,
  ConfigurationStatus,
  defaultIcalcListInformation,
  RISK_FACTORS,
  getMat017ItemChangesInConfigurations,
  Mat017ItemOverridesEnum,
  removeMat017ItemsInManyConfigurations,
  createCalculationDoesNotExistErrorMessage,
  createLockedCalculationCannotBeModifiedErrorMessage,
  updateOverridesOfMat017ItemsInConfigurations,
  StringUtils,
} from '@igus/icalc-domain';
import { ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';

import {
  ChainflexPriceChangeCheckService,
  SingleCableCalculationService,
  StatusService,
} from '../single-cable-calculation';

import {
  CalculationConfigurationStatusDataAccessService,
  CalculationDataAccessService,
  CalculationFilterQueryWithSearch,
  CalculationFilterWithCalculationFactor,
  CalculationFilterWithCustomerType,
  CalculationOrderBy,
  CalculationQueryWithRelations,
  SingleCableCalculationDataAccessService,
} from '@igus/icalc-calculations-infrastructure';
import { AuthDataAccessService } from '@igus/icalc-auth-infrastructure';
import { ConfigurationDataAccessService, Mat017ItemDataAccessService } from '@igus/icalc-configurations-infrastructure';
import type { DeepPartial } from 'typeorm';
import { ObjectUtils } from '@igus/icalc-utils';

@Injectable()
export class CalculationService {
  constructor(
    private readonly singleCableCalculationService: SingleCableCalculationService,
    private readonly singleCableCalculationDataAccessService: SingleCableCalculationDataAccessService,
    private readonly configurationDataAccessService: ConfigurationDataAccessService,
    private readonly calculationDataAccessService: CalculationDataAccessService,
    private readonly calculationConfigurationStatusDataAccessService: CalculationConfigurationStatusDataAccessService,
    private readonly authDataAccessService: AuthDataAccessService,
    private readonly chainflexPriceChangeCheckService: ChainflexPriceChangeCheckService,
    private readonly mat017ItemDataAccessService: Mat017ItemDataAccessService,
    private readonly statusService: StatusService
  ) {}

  public async getOne(calculationId: string): Promise<Calculation> {
    return this.calculationDataAccessService.findOneCalculation({
      id: calculationId,
    });
  }

  public async createNewConfigurationForExistingCalculation(
    { configuration, calculationId, singleCableCalculation }: CreateNewConfigurationForExistingCalculationRequestDto,
    userId: string
  ): Promise<SingleCableCalculation> {
    configuration.matNumber = StringUtils.removeTabsAndSpacesFromString(configuration.matNumber);
    if (!calculationId || !configuration || !singleCableCalculation) {
      throw new NotFoundException('');
    }

    const { matNumber, labelingLeft, labelingRight, description } = configuration;
    const { batchSize } = singleCableCalculation;

    const existingCalculation = await this.findCalculationById({
      id: calculationId,
    });

    if (!existingCalculation) {
      throw new ConflictException(`Calculation with calculation number ${calculationId} does not exist.`);
    }

    if (existingCalculation.status === CalculationStatus.locked) {
      throw new NotAcceptableException(
        `Calculation with id ${calculationId} is locked and no new configurations can be assigned to it.`
      );
    }

    const fullUser = await this.authDataAccessService.findUserById(userId);

    if (!fullUser) {
      throw new NotFoundException(`The User with given Id could not be found`);
    }

    const createdBy = UserMapper.toUserName(fullUser);

    const newConfiguration = await this.configurationDataAccessService.createFromRepo({
      matNumber,
      labelingLeft,
      labelingRight,
      description,
      createdBy,
      modifiedBy: createdBy,
      isCopyOfConfigurationId: null,
    });

    const resultSingleCableCalculation =
      await this.calculationDataAccessService.createAndAssignNewConfigurationTransactional(
        newConfiguration,
        existingCalculation,
        fullUser,
        batchSize
      );

    const modifiedCalculation: DeepPartial<Calculation> = {
      id: existingCalculation.id,
      modificationDate: new Date(),
      modifiedBy: UserMapper.toUserName(fullUser),
    };

    await this.calculationDataAccessService.save(modifiedCalculation);

    return this.singleCableCalculationDataAccessService.findOneBySingleCableCalculationId(
      resultSingleCableCalculation.id
    );
  }

  public async assignConfigurationToExistingCalculation(
    {
      calculationId,
      configurationId,
      singleCableCalculationBaseData,
    }: AssignConfigurationToExistingCalculationRequestDto,
    userId: string
  ): Promise<SingleCableCalculation> {
    if (!calculationId || !configurationId || !singleCableCalculationBaseData) {
      throw new NotFoundException('');
    }
    const existingCalculation = await this.findCalculationById({
      id: calculationId,
    });
    const existingConfiguration = await this.configurationDataAccessService.findOneById(configurationId);
    const { batchSize, chainflexLength } = singleCableCalculationBaseData;

    if (!existingCalculation) {
      throw new ConflictException(`Calculation with calculation number ${calculationId} does not exist.`);
    } else if (!existingConfiguration) {
      throw new ConflictException(`Configuration with MAT number ${configurationId} does not exist.`);
    }

    if (existingCalculation.status === CalculationStatus.locked) {
      throw new NotAcceptableException(
        `Calculation with id ${calculationId} is locked and no existing configurations can be assigned to it.`
      );
    }

    const fullUser = await this.authDataAccessService.findUserById(userId);

    const resultSingleCableCalculation = await this.calculationDataAccessService.linkExistingConfigurationTransactional(
      existingConfiguration,
      existingCalculation,
      fullUser,
      batchSize,
      chainflexLength
    );

    const modifiedCalculation: DeepPartial<Calculation> = {
      id: existingCalculation.id,
      modificationDate: new Date(),
      modifiedBy: UserMapper.toUserName(fullUser),
    };

    await this.calculationDataAccessService.save(modifiedCalculation);

    return this.singleCableCalculationDataAccessService.findOneBySingleCableCalculationId(
      resultSingleCableCalculation.id
    );
  }

  public async removeLinkBetweenConfigurationAndCalculation(
    {
      calculationId,
      configurationId,
      singleCableCalculationId,
    }: RemoveLinkBetweenConfigurationAndCalculationRequestDto,
    userId: string
  ): Promise<SingleCableCalculation> {
    if (!calculationId || !configurationId || !singleCableCalculationId) {
      throw new NotFoundException('');
    }
    const existingCalculation = await this.findCalculationById({
      id: calculationId,
    });

    if (!existingCalculation) {
      throw new ConflictException(`Calculation with calculation number ${calculationId} does not exist.`);
    }
    if (existingCalculation.status === CalculationStatus.locked) {
      throw new NotAcceptableException(`Calculation with id ${calculationId} is locked and cannot be modified.`);
    }

    const existingConfiguration = await this.configurationDataAccessService.findOneById(configurationId);

    if (!existingConfiguration) {
      throw new ConflictException(`Configuration with MAT number ${configurationId} does not exist.`);
    }

    const existingSingleCableCalculation = existingCalculation.singleCableCalculations.find(
      (item) => item.id === singleCableCalculationId
    );

    if (!existingSingleCableCalculation) {
      throw new ConflictException(`Single Cable Calculation with Id ${singleCableCalculationId} does not exist.`);
    }
    await this.calculationDataAccessService.removeLinkBetweenConfigurationAndCalculationTransactional(
      existingCalculation,
      existingSingleCableCalculation,
      existingConfiguration
    );

    const fullUser = await this.getFullUser(userId);
    const modifiedPartialCalculation: DeepPartial<Calculation> = {
      id: existingCalculation.id,
      modificationDate: new Date(),
      modifiedBy: UserMapper.toUserName(fullUser),
    };

    await this.calculationDataAccessService.save(modifiedPartialCalculation);

    return await this.singleCableCalculationDataAccessService.findOneByCalculationId(modifiedPartialCalculation.id);
  }

  public async canLinkBetweenConfigurationAndCalculationBeRemoved({
    singleCableCalculationId,
  }: CanLinkBetweenConfigurationAndCalculationBeRemovedRequestDto): Promise<{
    canLinkBetweenConfigurationAndCalculationBeRemoved: boolean;
  }> {
    if (!singleCableCalculationId) {
      throw new NotFoundException('');
    }

    const existingSingleCableCalculation =
      await this.singleCableCalculationDataAccessService.findOneById(singleCableCalculationId);

    if (!existingSingleCableCalculation) {
      throw new ConflictException(`Single Cable Calculation with id ${singleCableCalculationId} does not exist.`);
    }

    const existingCalculation = existingSingleCableCalculation.calculation;
    const existingConfiguration = existingSingleCableCalculation.configuration;

    const relatedSingleCableCalculationsOfExistingCalculation =
      await this.singleCableCalculationDataAccessService.findByCalculationId(existingCalculation?.id);

    const relatedSingleCableCalculationsOfExistingConfiguration =
      await this.singleCableCalculationDataAccessService.findByConfigurationId(existingConfiguration?.id);

    const relatedSingleCableCalculationsOfLockedConfiguration =
      await this.singleCableCalculationDataAccessService.findByConfigurationIdInSnapshot(existingConfiguration?.id);

    const allRelatedSingleCableCalculations = [
      ...relatedSingleCableCalculationsOfExistingConfiguration,
      ...relatedSingleCableCalculationsOfLockedConfiguration,
    ];

    return relatedSingleCableCalculationsOfExistingCalculation.length < 2 ||
      allRelatedSingleCableCalculations.length < 2
      ? { canLinkBetweenConfigurationAndCalculationBeRemoved: false }
      : {
          canLinkBetweenConfigurationAndCalculationBeRemoved: true,
        };
  }

  public async createCalculationAndConfiguration(
    createCalculationAndConfigurationDto: CreateCalculationAndConfigurationRequestDto,
    userId?: string
  ): Promise<SingleCableCalculation> {
    const { calculation, configuration } = createCalculationAndConfigurationDto;

    if (!calculation.calculationNumber) {
      throw new ConflictException('Calculation should have calculationNumber');
    }

    if (!configuration.matNumber) {
      throw new ConflictException('Configuration should have matNumber');
    }

    calculation.calculationNumber = StringUtils.removeTabsAndSpacesFromString(calculation.calculationNumber);
    configuration.matNumber = StringUtils.removeTabsAndSpacesFromString(configuration.matNumber);

    const { calculationNumber, calculationFactor, customerType, quoteNumber, customer } = calculation;
    const { matNumber, labelingLeft, labelingRight, partNumber, description, state } = configuration;

    if (!createCalculationAndConfigurationDto || !calculation || !configuration) {
      throw new NotFoundException('');
    }

    const existingCalculation = await this.calculationDataAccessService.findOneCalculation({
      calculationNumber,
    });

    // singleCableCalculations
    if (existingCalculation) {
      throw new ConflictException(`Calculation with calculation number ${calculationNumber} already exists.`);
    }

    const existingConfiguration = await this.configurationDataAccessService.findOneByMatNumber(matNumber);

    if (existingConfiguration) {
      throw new ConflictException(`Configuration with MAT number ${matNumber} already exists.`);
    }

    const fullUser = await this.authDataAccessService.findUserById(userId);
    const createdBy = UserMapper.toUserName(fullUser);

    const calculationEntity = this.calculationDataAccessService.createFromRepo({
      calculationNumber,
      calculationFactor,
      quoteNumber,
      customer,
      customerType,
      mat017ItemRiskFactor: RISK_FACTORS.defaultMat017ItemRiskFactor,
      mat017ItemAndWorkStepRiskFactor: RISK_FACTORS.defaultMat017ItemAndWorkStepRiskFactor,
      createdBy,
      modifiedBy: createdBy,
    });

    const configurationEntity = this.configurationDataAccessService.createFromRepo({
      matNumber,
      labelingLeft,
      labelingRight,
      description,
      createdBy,
      modifiedBy: createdBy,
      creationDate: new Date(),
      modificationDate: new Date(),
      partNumber,
      state,
    });

    const { singleCableCalculation } =
      await this.calculationDataAccessService.createNewCalculationAndConfigurationTransactional(
        calculationEntity,
        configurationEntity,
        createCalculationAndConfigurationDto.singleCableCalculation,
        fullUser
      );

    return await this.singleCableCalculationDataAccessService.findOneBySingleCableCalculationId(
      singleCableCalculation.id
    );
  }

  public async updateCalculation(
    updateCalculationDto: UpdateCalculationRequestDto,
    userId: string
  ): Promise<Partial<Calculation>> {
    let { calculationNumber } = updateCalculationDto;

    calculationNumber = StringUtils.removeTabsAndSpacesFromString(calculationNumber);
    const {
      calculationFactor,
      customerType,
      quoteNumber,
      customer,
      mat017ItemRiskFactor,
      mat017ItemAndWorkStepRiskFactor,
      singleCableCalculation,
    } = updateCalculationDto;

    const existingCalculation = await this.findCalculationForUpdate(calculationNumber);

    const fullUser = await this.getFullUser(userId);

    const updatedCalculation: DeepPartial<Calculation> = {
      id: existingCalculation.id,
      ...(calculationFactor && { calculationFactor }),
      ...(customerType && { customerType }),
      ...(quoteNumber && { quoteNumber }),
      ...(customer && { customer }),
      ...(mat017ItemRiskFactor && { mat017ItemRiskFactor }),
      ...(mat017ItemAndWorkStepRiskFactor && { mat017ItemAndWorkStepRiskFactor }),
    };

    if (!singleCableCalculation) {
      updatedCalculation.modificationDate = new Date();
      updatedCalculation.modifiedBy = UserMapper.toUserName(fullUser);

      return await this.calculationDataAccessService.save(updatedCalculation);
    }

    const { id, calculationFactor: sccCalculationFactor, batchSize, chainflexLength } = singleCableCalculation;

    let sccArray = ObjectUtils.cloneDeep<Partial<SingleCableCalculation>[]>(
      existingCalculation.singleCableCalculations
    );
    const updatedSCC = {
      id,
      ...(sccCalculationFactor !== undefined && { calculationFactor: sccCalculationFactor }), // omit only if undefined - allows setting to null
      ...(batchSize && { batchSize }),
      ...(chainflexLength && { chainflexLength }),
    };

    sccArray = sccArray.map((scc: SingleCableCalculation) => (scc.id === id ? { ...updatedSCC } : { id: scc.id }));

    updatedCalculation.singleCableCalculations = sccArray;

    const savedCalculation = await this.calculationDataAccessService.save(updatedCalculation);

    delete savedCalculation.singleCableCalculations;

    return {
      ...savedCalculation,
      singleCableCalculation: updatedSCC,
    } as Partial<Calculation>;
  }

  public async setExcelDownloadFlagsForCalculation(
    setExcelDownloadFlagsForCalculationDto: SetExcelDownloadFlagsForCalculationRequestDto,
    userId: string
  ): Promise<Partial<Calculation>> {
    const { calculationNumber, productionPlanExcelDownloaded, calculationExcelDownloaded } =
      setExcelDownloadFlagsForCalculationDto;

    const existingCalculation = await this.findCalculationForUpdate(calculationNumber);

    const fullUser = await this.getFullUser(userId);

    const updatedCalculation: DeepPartial<Calculation> = {
      id: existingCalculation.id,
      ...(productionPlanExcelDownloaded && { productionPlanExcelDownloaded }),
      ...(calculationExcelDownloaded && { calculationExcelDownloaded }),
    };

    const resultCalculation = await this.calculationDataAccessService.save(updatedCalculation);

    const reloadedCalculation = await this.calculationDataAccessService.findOneCalculation({
      id: resultCalculation.id,
    });

    if (reloadedCalculation.calculationExcelDownloaded && reloadedCalculation.productionPlanExcelDownloaded) {
      const lockedCalculation = await this.calculationDataAccessService.lockAndCreateConfigurationSnapshots(
        resultCalculation.id,
        userId,
        UserMapper.toUserName(fullUser)
      );

      resultCalculation.status = lockedCalculation.status;
      resultCalculation.lockingDate = lockedCalculation.lockingDate;
      resultCalculation.lockedBy = lockedCalculation.lockedBy;
    }

    return resultCalculation;
  }

  public async copyConfigurationToExistingCalculation(
    copyConfigurationToExistingCalculationDto: CopyConfigurationToExistingCalculationRequestDto,
    userId?: string
  ): Promise<SingleCableCalculation> {
    let { newMatNumber } = copyConfigurationToExistingCalculationDto;

    newMatNumber = StringUtils.removeTabsAndSpacesFromString(newMatNumber);
    const {
      calculationId,
      configurationId,
      createdBy,
      labelingLeft,
      labelingRight,
      description,
      batchSize,
      chainflexLength,
      updatePrices,
    } = copyConfigurationToExistingCalculationDto;

    let existingCalculation = await this.findCalculationById({ id: calculationId });

    if (existingCalculation === null) {
      throw new NotFoundException(`Calculation with id ${calculationId} was not found in db.`);
    }

    if (existingCalculation.status === CalculationStatus.locked) {
      throw new NotAcceptableException(
        `Calculation with id ${calculationId} is locked and no new configurations can be assigned to it.`
      );
    }

    const existingConfigurationItem = await this.copyExistingConfiguration(configurationId, updatePrices);
    const { id, partNumber, state } = existingConfigurationItem;

    // if a chainflex price is outdated, we want to use the new price in the copy
    const { chainflexPriceDeviationDetected, priceAvailable, currentPriceObject } =
      await this.chainflexPriceChangeCheckService.deviationDetected(state?.chainFlexState?.chainflexCable);

    if (chainflexPriceDeviationDetected && priceAvailable) {
      state.chainFlexState.chainflexCable.price = currentPriceObject;
    }

    const newConfiguration: Partial<Configuration> = {
      matNumber: newMatNumber,
      labelingLeft,
      labelingRight,
      description,
      partNumber,
      state,
      createdBy: createdBy ?? '',
      creationDate: new Date(),
      modificationDate: new Date(),
      modifiedBy: createdBy ?? '',
      isCopyOfConfigurationId: id,
    };

    const resultConfiguration = await this.configurationDataAccessService.save(newConfiguration);

    const calculationConfigurationStatus = {
      calculationId: existingCalculation.id,
      configurationId: resultConfiguration.id,
      status: ConfigurationStatus.notApproved,
      modificationDate: new Date(),
      modifiedBy: copyConfigurationToExistingCalculationDto?.createdBy,
    };

    await this.calculationConfigurationStatusDataAccessService.save(calculationConfigurationStatus);

    const fullUser = await this.authDataAccessService.findUserById(userId);

    const modifiedCalculation: DeepPartial<Calculation> = {
      id: existingCalculation.id,
      modificationDate: new Date(),
      modifiedBy: UserMapper.toUserName(fullUser),
    };

    await this.calculationDataAccessService.save(modifiedCalculation);

    existingCalculation = await this.findCalculationById({
      id: calculationId,
    });

    existingCalculation.calculationFactor = null;

    const resultScc = await this.singleCableCalculationService.createAndSaveSingleCableCalculation(
      resultConfiguration,
      existingCalculation,
      userId,
      { batchSize, chainflexLength }
    );

    return this.singleCableCalculationDataAccessService.findOneBySingleCableCalculationId(resultScc.id);
  }

  public async copyConfigurationToNewCalculation(
    copyConfigurationToNewCalculationDto: CopyConfigurationToNewCalculationRequestDto,
    userId: string
  ): Promise<SingleCableCalculation> {
    let { calculationNumber, newMatNumber } = copyConfigurationToNewCalculationDto;

    calculationNumber = StringUtils.removeTabsAndSpacesFromString(calculationNumber);
    newMatNumber = StringUtils.removeTabsAndSpacesFromString(newMatNumber);
    const {
      createdBy,
      calculationFactor,
      customer,
      quoteNumber,
      customerType,
      configurationId,
      labelingLeft,
      labelingRight,
      description,
      batchSize,
      chainflexLength,
      updatePrices,
    } = copyConfigurationToNewCalculationDto;

    const existingConfiguration = await this.copyExistingConfiguration(configurationId, updatePrices);

    // if a chainflex price is outdated, we want to use the new price in the copy
    const { chainflexPriceDeviationDetected, priceAvailable, currentPriceObject } =
      await this.chainflexPriceChangeCheckService.deviationDetected(
        existingConfiguration.state?.chainFlexState?.chainflexCable
      );

    if (chainflexPriceDeviationDetected && priceAvailable) {
      existingConfiguration.state.chainFlexState.chainflexCable.price = currentPriceObject;
    }

    delete existingConfiguration.id;

    const createCalculationAndConfigurationDto: CreateCalculationAndConfigurationRequestDto = {
      calculation: {
        calculationFactor,
        createdBy,
        calculationNumber,
        quoteNumber,
        customer,
        customerType,
      },
      configuration: {
        ...existingConfiguration,
        matNumber: newMatNumber,
        labelingLeft,
        labelingRight,
        description,
      },
      singleCableCalculation: {
        batchSize,
        chainflexLength,
      },
    };

    const singleCableCalculation = await this.createCalculationAndConfiguration(
      createCalculationAndConfigurationDto,
      userId
    );

    return await this.singleCableCalculationDataAccessService.findOneBySingleCableCalculationId(
      singleCableCalculation.id
    );
  }

  public async assignConfigurationItemsToCopiedCalculationDto(
    duplicateCalculation: AssignConfigurationItemsToCopiedCalculationRequestDto,
    userId: string
  ): Promise<SingleCableCalculation> {
    duplicateCalculation.newCalculationNumber = StringUtils.removeTabsAndSpacesFromString(
      duplicateCalculation.newCalculationNumber
    );
    const { calculationId, singleCableCalculationIds, newCalculationNumber, newQuoteNumber, newCustomer, createdBy } =
      duplicateCalculation;

    const existingCalculation = await this.calculationDataAccessService.queryCalculationById(calculationId);

    if (existingCalculation === null) {
      throw new NotFoundException(`Calculation with id ${calculationId} was not found in db.`);
    }

    const newCalculation =
      await this.calculationDataAccessService.createCalculationWithSingleCableCalculationsTransactional(
        existingCalculation,
        newCalculationNumber,
        newQuoteNumber,
        newCustomer,
        singleCableCalculationIds,
        createdBy,
        userId
      );

    return await this.singleCableCalculationDataAccessService.findOneByCalculationId(newCalculation.id);
  }

  public async setCalculationConfigurationStatusToApproved(
    userId: string,
    setCalculationConfigurationStatusToApprovedDto: SetCalculationConfigurationStatusToApprovedRequestDto
  ): Promise<CalculationConfigurationStatus> {
    const existingCalculationItem = await this.findCalculationById({
      id: setCalculationConfigurationStatusToApprovedDto.calculationId,
    });

    if (!existingCalculationItem) {
      throw new NotFoundException(
        `No matching calculation for given id (${setCalculationConfigurationStatusToApprovedDto.calculationId}) found.`
      );
    }

    const existingConfigurationItem = await this.configurationDataAccessService.findOneById(
      setCalculationConfigurationStatusToApprovedDto.configurationId
    );

    if (!existingConfigurationItem) {
      throw new NotFoundException(
        `No matching configuration item for given id (${setCalculationConfigurationStatusToApprovedDto.configurationId}) found.`
      );
    }

    const newStatus = {
      ...setCalculationConfigurationStatusToApprovedDto,
      status: ConfigurationStatus.approved,
      modifiedBy: userId,
      modificationDate: new Date(),
    };

    return this.calculationConfigurationStatusDataAccessService.save(newStatus);
  }

  public async findCalculationByNumber({
    calculationNumber,
  }: FindCalculationByCalculationNumberRequestDto): Promise<Calculation> {
    return this.calculationDataAccessService.queryCalculationByNumber(
      StringUtils.removeTabsAndSpacesFromString(calculationNumber)
    );
  }

  public async findCalculationById(findCalculationDto: FindCalculationByIdRequestDto): Promise<Calculation> {
    return this.calculationDataAccessService.queryCalculationById(findCalculationDto.id);
  }

  public async getAllCalculations(): Promise<Calculation[]> {
    return this.calculationDataAccessService.queryAllCalculations();
  }

  public async filterCalculations(
    filter: IcalcMetaDataFilter,
    operands: IcalcCalculationOperands,
    listInformation: Partial<IcalcListInformation>
  ): Promise<IcalcListResult<Calculation>> {
    const listParameter = {
      ...defaultIcalcListInformation,
      ...listInformation,
    } as IcalcListInformation;

    const currentOperands = {
      calculationFactor: operands.calculationFactorOperand || '=',
    };

    const baseQuery = this.calculationDataAccessService.createQueryForSearch();

    let newQuery = new CalculationQueryWithRelations(baseQuery);

    if (listParameter?.search) {
      newQuery = new CalculationFilterQueryWithSearch(newQuery.baseQuery, listParameter.search);
    }

    if (filter?.customerType) {
      newQuery = new CalculationFilterWithCustomerType(newQuery.baseQuery, filter?.customerType);
    }

    if (filter?.calculationFactor) {
      newQuery = new CalculationFilterWithCalculationFactor(
        newQuery.baseQuery,
        currentOperands.calculationFactor,
        filter.calculationFactor
      );
    }

    newQuery = new CalculationOrderBy(newQuery.baseQuery, listParameter);

    const [data, totalCount] = await newQuery.baseQuery.getManyAndCount();

    return { data, totalCount, listParameter };
  }

  public async filterCalculationsSearch(
    filter: IcalcMetaDataFilter,
    operands: IcalcCalculationOperands,
    listInformation: Partial<IcalcListInformation>
  ): Promise<IcalcListResult<Calculation>> {
    const listParameter = {
      ...defaultIcalcListInformation,
      ...listInformation,
    } as IcalcListInformation;

    const currentOperands = {
      calculationFactor: operands.calculationFactorOperand || '=',
    };

    const baseQuery = this.calculationDataAccessService.createQueryOfCalculationsWithRelations();

    let newQuery = new CalculationQueryWithRelations(baseQuery);

    if (listParameter?.search) {
      newQuery = new CalculationFilterQueryWithSearch(newQuery.baseQuery, listParameter.search);
    }

    if (filter?.customerType) {
      newQuery = new CalculationFilterWithCustomerType(newQuery.baseQuery, filter?.customerType);
    }

    if (filter?.calculationFactor) {
      newQuery = new CalculationFilterWithCalculationFactor(
        newQuery.baseQuery,
        currentOperands.calculationFactor,
        filter.calculationFactor
      );
    }

    newQuery = new CalculationOrderBy(newQuery.baseQuery, listParameter);

    const [data, totalCount] = await newQuery.baseQuery.getManyAndCount();

    return { data, totalCount, listParameter };
  }

  public async updateMat017ItemsOverridesInManyConfigurations(
    { updateProperties, configurationIds, calculationId }: UpdateMat017OverridesRequestDto,
    userId: string
  ): Promise<{
    configurations: Configuration[];
    mat017ItemBaseDataMap: Mat017ItemsBaseDataMap;
    resetApprovalResultMap: CalculationConfigurationApprovalStatusByConfigurationId;
    configurationsWithRemovedOverridesMap?: ConfigurationsWithRemovedOverridesMap;
  }> {
    const existingCalculation = await this.calculationDataAccessService.findOneCalculation({
      id: calculationId,
    });

    if (!existingCalculation) {
      throw new ConflictException(`Calculation with calculation number ${calculationId} does not exist.`);
    }

    if (existingCalculation.status === CalculationStatus.locked) {
      throw new NotAcceptableException(`Calculation with id ${calculationId} is locked and cannot be modified.`);
    }

    const selectedConfigurationDetails = await this.configurationDataAccessService.findManyByIds(configurationIds);

    const mat017ItemBaseDataMap =
      await this.mat017ItemDataAccessService.generateMat017ItemBaseDataMap(selectedConfigurationDetails);

    const { updatedConfigurations, configurationsWithChangedMat017ItemGroups, configurationsWithRemovedOverridesMap } =
      updateOverridesOfMat017ItemsInConfigurations(
        updateProperties,
        mat017ItemBaseDataMap,
        selectedConfigurationDetails
      );

    await this.configurationDataAccessService.saveStateInManyConfigurationsTransactional(updatedConfigurations, [
      'workStepOverrides',
      'connectorState',
    ]);

    const resetApprovalResultMap: CalculationConfigurationApprovalStatusByConfigurationId =
      await this.statusService.resetApprovalIfStatusApprovedForManyConfigurations(
        userId,
        calculationId,
        configurationsWithChangedMat017ItemGroups
      );

    return {
      configurations: updatedConfigurations,
      mat017ItemBaseDataMap,
      resetApprovalResultMap,
      configurationsWithRemovedOverridesMap,
    };
  }

  public async removeMat017ItemsInManyConfigurations(
    { calculationId, configurations }: RemoveMat017ItemsRequestDto,
    userId: string
  ): Promise<RemoveMat017ItemsInManyConfigurationsResult> {
    const existingCalculation = await this.calculationDataAccessService.findOneCalculation({
      id: calculationId,
    });

    if (!existingCalculation) {
      throw new ConflictException(createCalculationDoesNotExistErrorMessage(calculationId));
    }

    if (existingCalculation.status === CalculationStatus.locked) {
      throw new NotAcceptableException(createLockedCalculationCannotBeModifiedErrorMessage(calculationId));
    }

    const selectedConfigurationDetails = await this.configurationDataAccessService.findManyByIds(
      configurations.map((config) => config.configurationId)
    );

    const mat017ItemBaseDataMap =
      await this.mat017ItemDataAccessService.generateMat017ItemBaseDataMap(selectedConfigurationDetails);

    const mat017ItemsByConfigurationId: Record<string, string[]> = configurations.reduce(
      (acc: Record<string, string[]>, config) => {
        const configurationObject = acc[config.configurationId];
        const mat017Items = config.mat017Items;

        if (configurationObject && configurationObject.length > 0) {
          configurationObject.push(...mat017Items);
        } else acc[config.configurationId] = mat017Items;
        return acc;
      },
      {}
    );

    const updatedConfigurationsResult = removeMat017ItemsInManyConfigurations(
      selectedConfigurationDetails,
      mat017ItemsByConfigurationId
    );

    const updatedConfigurations = updatedConfigurationsResult.updatedConfigurations.map(
      (result) => result.configuration
    );

    await this.configurationDataAccessService.saveStateInManyConfigurationsTransactional(updatedConfigurations, [
      'workStepOverrides',
      'connectorState',
    ]);

    const configurationIds = selectedConfigurationDetails
      .filter((config) => updatedConfigurationsResult.configurationsWithRemovedMat017ItemsMap.has(config.id))
      .map((config) => config.id);

    const resetApprovalResultMap: CalculationConfigurationApprovalStatusByConfigurationId =
      await this.statusService.resetApprovalIfStatusApprovedForManyConfigurations(
        userId,
        calculationId,
        configurationIds
      );

    return {
      configurations: updatedConfigurations,
      mat017ItemBaseDataMap,
      resetApprovalResultMap,
      configurationsWithRemovedOverrides: updatedConfigurationsResult.configurationsWithRemovedOverrides,
    };
  }

  public async haveMat017ItemsOverridesChanged({
    configurationIds,
  }: HaveMat017ItemsOverridesChangedRequestDto): Promise<HaveMat017ItemsOverridesChangedResponseDto> {
    const uniqueConfigurationIds = Array.from(new Set(configurationIds));
    const selectedConfigurationDetails =
      await this.configurationDataAccessService.findManyByIds(uniqueConfigurationIds);

    const orderedSelectedConfigurationDetails = this.getOriginalOrderOfConfigurations(
      uniqueConfigurationIds,
      selectedConfigurationDetails
    );

    const mat017ItemBaseDataMap = await this.mat017ItemDataAccessService.generateMat017ItemBaseDataMap(
      orderedSelectedConfigurationDetails
    );

    return getMat017ItemChangesInConfigurations(orderedSelectedConfigurationDetails, mat017ItemBaseDataMap);
  }

  private async findCalculationForUpdate(calculationNumber: string): Promise<Calculation> {
    const existingCalculation = await this.calculationDataAccessService.queryCalculationByNumber(calculationNumber);

    if (existingCalculation === null) {
      throw new NotFoundException(`Calculation with calculationNumber ${calculationNumber} was not found in db.`);
    }

    if (existingCalculation.status === CalculationStatus.locked) {
      throw new NotAcceptableException(
        `Calculation with calculationNumber ${calculationNumber} is locked and can not be updated.`
      );
    }

    return existingCalculation;
  }

  private async getFullUser(userId: string): Promise<IcalcUser> {
    const fullUser = await this.authDataAccessService.findUserById(userId);

    if (!fullUser) {
      throw new NotFoundException(`The User with given Id could not be found`);
    }

    return fullUser;
  }

  private getOriginalOrderOfConfigurations(originalOrder: string[], configurations: Configuration[]): Configuration[] {
    return configurations.sort((a, b) => originalOrder.indexOf(a.id) - originalOrder.indexOf(b.id));
  }

  private async copyExistingConfiguration(
    configurationId: string,
    copyWithUpdatedMat017Overrides: boolean
  ): Promise<Configuration> {
    let existingConfigurationItem = await this.configurationDataAccessService.findOneById(configurationId);

    if (existingConfigurationItem === null) {
      throw new NotFoundException(`Configuration with id ${configurationId} was not found in db.`);
    }

    if (copyWithUpdatedMat017Overrides) {
      const mat017ItemBaseDataMap = await this.mat017ItemDataAccessService.generateMat017ItemBaseDataMap([
        existingConfigurationItem,
      ]);
      const { updatedConfigurations: configurationWithUpdatedPrices } = updateOverridesOfMat017ItemsInConfigurations(
        [Mat017ItemOverridesEnum.amountDividedByPriceUnit],
        mat017ItemBaseDataMap,
        [existingConfigurationItem]
      );

      existingConfigurationItem = ObjectUtils.cloneDeep(configurationWithUpdatedPrices[0]);
    }
    return existingConfigurationItem;
  }
}
