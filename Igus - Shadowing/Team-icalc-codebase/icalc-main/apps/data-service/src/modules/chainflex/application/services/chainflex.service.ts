import type {
  ChainflexCable,
  IcalcListInformation,
  IcalcListResult,
  CableStructureInformation,
} from '@igus/icalc-domain';
import { defaultIcalcListInformation } from '@igus/icalc-domain';
import { ArrayUtils } from '@igus/icalc-utils';
import { Injectable } from '@nestjs/common';
import { Logger } from '../../../../logger';
import type { DeleteResult, UpdateResult } from 'typeorm';
import { ChainflexDataAccessService } from '@igus/icalc-configurations-infrastructure';

@Injectable()
export class ChainflexService {
  constructor(
    private readonly logger: Logger,
    private readonly chainFlexDataAccessService: ChainflexDataAccessService
  ) {}

  public async searchChainflexItem(
    listInformation: Partial<IcalcListInformation>
  ): Promise<IcalcListResult<ChainflexCable>> {
    const listParameter = {
      ...defaultIcalcListInformation,
      ...listInformation,
    };

    const [data, totalCount] = await this.chainFlexDataAccessService.getManyChainflexItemsAndCount(listParameter);

    return { data, totalCount, listParameter };
  }

  public async createChainflex(chainflex: ChainflexCable): Promise<ChainflexCable> {
    const result = this.chainFlexDataAccessService.saveOne(chainflex);

    return result;
  }

  public async deleteChainflexByPartNumber(partNumber: string): Promise<DeleteResult> {
    return this.chainFlexDataAccessService.deleteByPartNumnber(partNumber);
  }

  public async importChainflexItems(items: ChainflexCable[]): Promise<{ success: boolean }> {
    this.logger.log('Akeneo items are going to be deleted', 'DataService - Akeneo Items to be deleted');
    const deleteResult = await this.chainFlexDataAccessService.deleteAll();

    this.logger.log(
      'Akeneo items deleted successfully',
      'DataService - deleted akeneo items: ' + deleteResult?.affected
    );

    this.logger.log(
      'Akeneo items are going to be saved into the db',
      `DataService - ${items?.length} Items to be saved`
    );
    const result = await this.chainFlexDataAccessService.saveMany(items);

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
    const result = await this.chainFlexDataAccessService.updateCableStructureInformationByPartNumber(
      partNumber,
      cableStructureInformation
    );

    return result;
  }

  public async getCableStructureInformationByPartNumber(
    partNumber: string
  ): Promise<CableStructureInformation | undefined> {
    const result = await this.chainFlexDataAccessService.findOneByPartNumber(partNumber);

    const cableStructureInformation = result?.cableStructureInformation;

    if (cableStructureInformation) {
      return cableStructureInformation;
    } else {
      return undefined;
    }
  }
}
