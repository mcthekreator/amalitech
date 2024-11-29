import { CalculationConfigurationStatusEntity } from '@igus/icalc-entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { Repository } from 'typeorm';

import type {
  SetCalculationConfigurationStatusToApprovedRequestDto,
  FindCalculationConfigurationStatusByIdsRequestDto,
  CalculationConfigurationApprovalStatus,
  CalculationConfigurationStatus,
  CalculationConfigurationApprovalStatusByConfigurationId,
  CalculationConfigurationApprovalStatusReset,
} from '@igus/icalc-domain';

import { UserMapper, ConfigurationStatus } from '@igus/icalc-domain';
import { CalculationDataAccessService } from '@igus/icalc-calculations-infrastructure';
import { AuthDataAccessService } from '@igus/icalc-auth-infrastructure';
import { ConfigurationDataAccessService } from '@igus/icalc-configurations-infrastructure';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(CalculationConfigurationStatusEntity, ICALC_CONNECTION)
    private readonly calculationConfigurationStatusRepository: Repository<CalculationConfigurationStatus>,
    private readonly calculationDataAccessService: CalculationDataAccessService,
    private readonly configurationDataAccessService: ConfigurationDataAccessService,
    private readonly authDataAccessService: AuthDataAccessService
  ) {}

  public async setCalculationConfigurationStatusToApproved(
    userId: string,
    setCalculationConfigurationStatusToApprovedDto: SetCalculationConfigurationStatusToApprovedRequestDto
  ): Promise<CalculationConfigurationStatus> {
    const existingCalculationItem = await this.calculationDataAccessService.queryCalculationById(
      setCalculationConfigurationStatusToApprovedDto.calculationId
    );

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

    const fullUser = await this.authDataAccessService.findUserById(userId);

    if (!fullUser) {
      throw new NotFoundException(`The User with given Id could not be found`);
    }

    const newStatus = {
      ...setCalculationConfigurationStatusToApprovedDto,
      status: ConfigurationStatus.approved,
      modifiedBy: UserMapper.toUserName(fullUser),
      modificationDate: new Date(),
    };

    return this.calculationConfigurationStatusRepository.save(newStatus);
  }

  public async findCalculationConfigurationStatusByIds(
    findCalculationConfigurationStatusByIdsDto: FindCalculationConfigurationStatusByIdsRequestDto
  ): Promise<CalculationConfigurationStatus> {
    return this.calculationConfigurationStatusRepository.findOneBy({
      calculationId: findCalculationConfigurationStatusByIdsDto.calculationId,
      configurationId: findCalculationConfigurationStatusByIdsDto.configurationId,
    });
  }

  public async resetApprovalIfStatusApproved(
    userId: string,
    calculationId: string,
    configurationId: string
  ): Promise<CalculationConfigurationApprovalStatus> {
    const calculationConfigurationStatus = await this.calculationConfigurationStatusRepository.findOneBy({
      calculationId,
      configurationId,
    });

    if (!calculationConfigurationStatus) {
      throw new NotFoundException('CalculationConfigurationStatus not found');
    }

    if (calculationConfigurationStatus.status === ConfigurationStatus.approved) {
      await this.calculationConfigurationStatusRepository.update(
        { calculationId, configurationId },
        { status: ConfigurationStatus.notApproved, modifiedBy: userId, modificationDate: new Date() }
      );
      return { hasApprovalBeenRevoked: true };
    }

    return { hasApprovalBeenRevoked: false };
  }

  public async resetApprovalIfStatusApprovedForManyConfigurations(
    userId: string,
    calculationId: string,
    configurationIds: string[]
  ): Promise<CalculationConfigurationApprovalStatusByConfigurationId> {
    const resetApprovalResultArray: CalculationConfigurationApprovalStatusReset[] = await Promise.all(
      configurationIds.map(async (configId) => ({
        configurationId: configId,
        ...(await this.resetApprovalIfStatusApproved(userId, calculationId, configId)),
      }))
    );

    const resetApprovalResultMap: CalculationConfigurationApprovalStatusByConfigurationId =
      resetApprovalResultArray.reduce(
        (
          acc: CalculationConfigurationApprovalStatusByConfigurationId,
          next: CalculationConfigurationApprovalStatusReset
        ) => {
          const { configurationId, hasApprovalBeenRevoked } = next;

          return acc.set(configurationId, { hasApprovalBeenRevoked });
        },
        new Map<string, CalculationConfigurationApprovalStatus>()
      );

    return resetApprovalResultMap;
  }
}
