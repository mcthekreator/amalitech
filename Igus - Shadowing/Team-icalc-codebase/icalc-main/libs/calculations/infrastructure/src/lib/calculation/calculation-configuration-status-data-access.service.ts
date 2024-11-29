import type { CalculationConfigurationStatus } from '@igus/icalc-domain';
import { ConfigurationStatus } from '@igus/icalc-domain';
import { CalculationConfigurationStatusEntity } from '@igus/icalc-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { Repository } from 'typeorm';
import type { QueryRunner } from 'typeorm';

@Injectable()
export class CalculationConfigurationStatusDataAccessService {
  constructor(
    @InjectRepository(CalculationConfigurationStatusEntity, ICALC_CONNECTION)
    private readonly calculationConfigurationStatusRepository: Repository<CalculationConfigurationStatus>
  ) {}

  public createFromRepo(
    calculationId: string,
    configurationId: string,
    modifiedBy: string
  ): CalculationConfigurationStatus {
    return this.calculationConfigurationStatusRepository.create({
      calculationId,
      configurationId,
      status: ConfigurationStatus.notApproved,
      modificationDate: new Date(),
      modifiedBy,
    });
  }

  public save(
    calculationConfigurationStatus: Partial<CalculationConfigurationStatus>
  ): Promise<CalculationConfigurationStatus> {
    return this.calculationConfigurationStatusRepository.save(calculationConfigurationStatus);
  }

  public findManyByConfigurationId(configurationId: string): Promise<CalculationConfigurationStatus[]> {
    return this.calculationConfigurationStatusRepository.find({
      where: {
        configurationId,
      },
    });
  }

  public queryByCalcIdAndConfId(
    calcId: string,
    configId: string,
    queryRunner?: QueryRunner
  ): Promise<CalculationConfigurationStatus> {
    return this.calculationConfigurationStatusRepository
      .createQueryBuilder('calculationConfigurationStatus', queryRunner)
      .where({ calculationId: calcId })
      .andWhere({ configurationId: configId })
      .getOne();
  }
}
