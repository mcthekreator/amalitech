import type {
  ChainflexCable,
  IcalcListInformation,
  IcalcListResult,
  CableStructureInformation,
} from '@igus/icalc-domain';
import { defaultIcalcListInformation } from '@igus/icalc-domain';
import { ChainflexEntity } from '@igus/icalc-entities';
import { ArrayUtils, NumberUtils } from '@igus/icalc-utils';
import { Injectable } from '@nestjs/common';
import { Logger } from '../../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import type { DeleteResult, UpdateResult } from 'typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChainflexService {
  constructor(
    @InjectRepository(ChainflexEntity, ICALC_CONNECTION)
    private readonly chainflexRepository: Repository<ChainflexCable>,
    private readonly logger: Logger
  ) {}

  public async searchChainflexItem(
    listInformation: Partial<IcalcListInformation>
  ): Promise<IcalcListResult<ChainflexCable>> {
    const listParameter = {
      ...defaultIcalcListInformation,
      ...listInformation,
    };

    const queryBuilder = this.chainflexRepository.createQueryBuilder('chainflex');

    let orderBy = '';

    if (
      listParameter.orderBy === 'description' ||
      listParameter.orderBy === 'outerJacket' ||
      listParameter.orderBy === 'nominalCrossSection' ||
      listParameter.orderBy === 'cableStructure'
    ) {
      orderBy = `lower(chainflex.${listParameter.orderBy} ->>'de_DE')`;
    } else if (listParameter.orderBy === 'outerDiameter') {
      orderBy = `lower(chainflex.${listParameter.orderBy} ->>'amount')`;
    } else if (listParameter.orderBy === 'price') {
      orderBy = 'price.germanListPrice';
    } else if (listParameter.orderBy === 'overallShield' || listParameter.orderBy === 'ul') {
      orderBy = `chainflex.${listParameter.orderBy}`;
    } else {
      orderBy = `lower(chainflex.${listParameter.orderBy})`;
    }

    let query = queryBuilder.innerJoinAndSelect('chainflex.price', 'price');

    if (typeof listParameter.search === 'string' && listParameter) {
      query = query.where('chainflex.partNumber ilike :search', { search: `%${listParameter.search}%` });
    }
    query = query
      .orderBy(orderBy, listParameter.orderDirection?.toUpperCase?.() === 'ASC' ? 'ASC' : 'DESC')
      .offset(listParameter.skip)
      .limit(listParameter.take);

    const [data, totalCount] = await query.getManyAndCount();

    data.forEach((chainflexCable) => {
      chainflexCable.price.germanListPrice = NumberUtils.round(chainflexCable?.price?.germanListPrice); // all chainflex prices should be commercially rounded on import (see ICALC-248)
    });

    return { data, totalCount, listParameter };
  }

  public async createChainflex(chainflex: ChainflexCable): Promise<ChainflexCable> {
    const result = this.chainflexRepository.save(chainflex);

    return result;
  }

  public async deleteChainflex(partNumber: string): Promise<DeleteResult> {
    const result = this.chainflexRepository.delete({ partNumber });

    return result;
  }

  public async importChainflexItems(items: ChainflexCable[]): Promise<{ success: boolean }> {
    this.logger.log('Akeneo items are going to be deleted', 'DataService - Akeneo Items to be deleted');
    const deleteResult = await this.chainflexRepository.delete({});

    this.logger.log(
      'Akeneo items deleted successfully',
      'DataService - deleted akeneo items: ' + deleteResult?.affected
    );

    this.logger.log(
      'Akeneo items are going to be saved into the db',
      `DataService - ${items?.length} Items to be saved`
    );
    const result = await this.chainflexRepository.save(items);

    this.logger.log('Akeneo items saved into the db', `DataService - ${items?.length} Items saved`);
    if (ArrayUtils.isNotEmpty(result)) {
      return { success: true };
    }

    return { success: false };
  }

  public async addCableStructureInformationToChainflexItem(
    partNumber: string,
    cableStructureInformation: CableStructureInformation
  ): Promise<UpdateResult> {
    const result = await this.chainflexRepository.update({ partNumber }, { cableStructureInformation });

    return result;
  }

  public async getCableStructureInformationByPartNumber(
    partNumber: string
  ): Promise<CableStructureInformation | undefined> {
    const result = await this.chainflexRepository.findOne({
      where: {
        partNumber,
      },
    });
    const cableStructureInformation = result?.cableStructureInformation;

    if (cableStructureInformation) {
      return cableStructureInformation;
    } else {
      return undefined;
    }
  }
}
