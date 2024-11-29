import type { ChainflexCable, IcalcListInformation, CableStructureInformation } from '@igus/icalc-domain';
import { ChainflexEntity } from '@igus/icalc-entities';
import { ArrayUtils } from '@igus/icalc-utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import type { DeleteResult, UpdateResult } from 'typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChainflexDataAccessService {
  constructor(
    @InjectRepository(ChainflexEntity, ICALC_CONNECTION)
    private readonly chainflexRepository: Repository<ChainflexCable>
  ) {}

  public async getManyChainflexItemsAndCount(
    listInformation: Partial<IcalcListInformation>
  ): Promise<[ChainflexCable[], number]> {
    const queryBuilder = this.chainflexRepository.createQueryBuilder('chainflex');

    let orderBy = '';

    if (
      listInformation.orderBy === 'description' ||
      listInformation.orderBy === 'outerJacket' ||
      listInformation.orderBy === 'nominalCrossSection' ||
      listInformation.orderBy === 'cableStructure'
    ) {
      orderBy = `lower(chainflex.${listInformation.orderBy} ->>'de_DE')`;
    } else if (listInformation.orderBy === 'outerDiameter') {
      orderBy = `lower(chainflex.${listInformation.orderBy} ->>'amount')`;
    } else if (listInformation.orderBy === 'price') {
      orderBy = 'price.germanListPrice';
    } else if (listInformation.orderBy === 'overallShield' || listInformation.orderBy === 'ul') {
      orderBy = `chainflex.${listInformation.orderBy}`;
    } else {
      orderBy = `lower(chainflex.${listInformation.orderBy})`;
    }

    let query = queryBuilder.innerJoinAndSelect('chainflex.price', 'price');

    if (typeof listInformation.search === 'string' && listInformation) {
      query = query.where('chainflex.partNumber ilike :search', { search: `%${listInformation.search}%` });
    }
    query = query
      .orderBy(orderBy, listInformation.orderDirection?.toUpperCase?.() === 'ASC' ? 'ASC' : 'DESC')
      .offset(listInformation.skip)
      .limit(listInformation.take);

    return query.getManyAndCount();
  }

  public async saveOne(chainflex: ChainflexCable): Promise<ChainflexCable> {
    const result = this.chainflexRepository.save(chainflex);

    return result;
  }

  public async saveMany(chainflexItems: ChainflexCable[]): Promise<ChainflexCable[]> {
    const result = this.chainflexRepository.save(chainflexItems);

    return result;
  }

  public async deleteByPartNumnber(partNumber: string): Promise<DeleteResult> {
    const result = this.chainflexRepository.delete({ partNumber });

    return result;
  }

  public async deleteAll(): Promise<DeleteResult> {
    const result = this.chainflexRepository.delete({});

    return result;
  }

  public async importChainflexItems(items: ChainflexCable[]): Promise<{ success: boolean }> {
    await this.deleteAll();

    const result = await this.chainflexRepository.save(items);

    if (ArrayUtils.isNotEmpty(result)) {
      return { success: true };
    }

    return { success: false };
  }

  public async updateCableStructureInformationByPartNumber(
    partNumber: string,
    cableStructureInformation: CableStructureInformation
  ): Promise<UpdateResult> {
    const result = await this.chainflexRepository.update({ partNumber }, { cableStructureInformation });

    return result;
  }

  public async findOneByPartNumber(partNumber: string): Promise<ChainflexCable> {
    return this.chainflexRepository.findOne({
      where: {
        partNumber,
      },
    });
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
