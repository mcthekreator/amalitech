import type {
  IcalcCalculationOperands,
  IcalcListInformation,
  IcalcListResult,
  IcalcMetaDataFilter,
  Configuration,
  FindConfigurationByIdRequestDto,
  FindConfigurationByMatNumberRequestDto,
} from '@igus/icalc-domain';
import { defaultIcalcListInformation } from '@igus/icalc-domain';
import { ConfigurationEntity } from '@igus/icalc-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';

import { Repository } from 'typeorm';
import { ConfigurationDataAccessService, Mat017ItemDataAccessService } from '@igus/icalc-configurations-infrastructure';

const orderByColumnsMap = {
  calculationNumber: 'calculation_number',
  matNumber: 'mat_number',
  labelingLeft: 'labeling_left',
  labelingRight: 'labelingRight',
  batchSize: 'batch_size',
  calculationFactor: 'calculation_factor',
  customerType: 'customer_type',
  creationDate: 'configuration.creation_date',
  createdBy: 'configuration.created_by',
  modificationDate: 'configuration.modification_date',
  modifiedBy: 'configuration.modified_by',
};

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(ConfigurationEntity, ICALC_CONNECTION)
    private readonly configurationRepository: Repository<Configuration>,

    private readonly configurationDataAccessService: ConfigurationDataAccessService,
    private readonly mat017ItemService: Mat017ItemDataAccessService
  ) {}

  public async findConfigurationByNumber(
    findConfigurationDto: FindConfigurationByMatNumberRequestDto
  ): Promise<Configuration> {
    return await this.configurationRepository.findOneBy({ matNumber: findConfigurationDto.matNumber });
  }

  public async findConfigurationById(findConfigurationDto: FindConfigurationByIdRequestDto): Promise<Configuration> {
    return this.configurationRepository.findOneBy({ id: findConfigurationDto.id });
  }

  public async getAllConfiguration(): Promise<Configuration[]> {
    return this.configurationRepository.find();
  }

  public async filterConfiguration(
    filter: IcalcMetaDataFilter,
    operands: IcalcCalculationOperands,
    listInformation: Partial<IcalcListInformation>
  ): Promise<IcalcListResult<Configuration>> {
    const listParameter = {
      ...defaultIcalcListInformation,
      ...listInformation,
    } as IcalcListInformation;

    const currentOperands = {
      batchSize: operands.batchSizeOperand || '=',
    };

    let query = this.configurationRepository
      .createQueryBuilder('configuration')
      .select([
        'configuration.id',
        'configuration.matNumber',
        'configuration.labelingLeft',
        'configuration.labelingRight',
        'configuration.description',
        'configuration.creationDate',
        'configuration.modificationDate',
        'configuration.createdBy',
        'configuration.modifiedBy',
        'configuration.partNumber',
      ])
      .leftJoinAndSelect('configuration.singleCableCalculations', 'scc')
      .leftJoinAndSelect('scc.calculation', 'calculation')
      .leftJoinAndSelect('configuration.snapshots', 'snapshot')
      .addSelect(['snapshot.id'])
      .leftJoinAndSelect('snapshot.singleCableCalculation', 'snapshotScc')
      .leftJoinAndSelect('snapshotScc.calculation', 'snapshotSccCalculation');

    if (listParameter?.search) {
      const subQuery = this.configurationRepository
        .createQueryBuilder()
        .select('configuration.id')

        /*
         * Joining the ConfigurationEntity with SingleCableCalculationEntity directly,
         * and also with SingleCableCalculationEntity that are related through ConfigurationSnapshotEntity.
         */
        .from(ConfigurationEntity, 'configuration')
        .leftJoin('configuration.singleCableCalculations', 'scc')
        .leftJoin('scc.calculation', 'calculation')
        .leftJoin('configuration.snapshots', 'snapshot')
        .leftJoin('snapshot.singleCableCalculation', 'snapshotScc')
        .leftJoin('snapshotScc.calculation', 'snapshotSccCalculation')

        /*
         * Applying the search criteria to the calculation number in both direct and indirect (via snapshot) calculations,
         * and also to the mat number in the configuration.
         */
        .where(
          `calculation.calculation_number ILIKE :searchStr
        OR configuration.mat_number ILIKE :searchStr
        OR snapshotSccCalculation.calculation_number ILIKE :searchStr`,
          { searchStr: `%${listParameter.search}%` }
        );

      query = query.andWhere(`configuration.id IN (${subQuery.getQuery()})`);
      query.setParameters({ searchStr: `%${listParameter.search}%` });
    }

    if (filter?.labeling) {
      query = query.andWhere(
        '(configuration.labelingLeft ilike :labeling or configuration.labelingRight ilike :labeling)',
        {
          labeling: `%${filter?.labeling}%`,
        }
      );
    }

    if (filter?.batchSize) {
      query = query.andWhere(`scc.batch_size ${currentOperands.batchSize} ${filter.batchSize}`);
    }

    let orderBy = 'mat_number';

    if (listInformation.orderBy) {
      orderBy = orderByColumnsMap[listInformation.orderBy] || 'mat_number';
    }

    query = query
      .orderBy(orderBy, listParameter.orderDirection?.toUpperCase?.() === 'ASC' ? 'ASC' : 'DESC')
      .offset(listParameter.skip)
      .limit(listParameter.take);

    const [data, totalCount] = await query.getManyAndCount();

    return { data, totalCount, listParameter };
  }
}
