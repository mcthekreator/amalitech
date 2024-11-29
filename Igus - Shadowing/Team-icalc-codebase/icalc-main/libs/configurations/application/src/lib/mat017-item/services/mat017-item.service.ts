import { CreateMat017ItemManuallyResponseDto } from '@igus/icalc-domain';
import type {
  IcalcListResult,
  Mat017Item,
  Mat017ItemListParameter,
  Mat017ItemSearchResult,
  Mat017ItemsLatestModificationDate,
} from '@igus/icalc-domain';
import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Mat017ItemDataAccessService } from '@igus/icalc-configurations-infrastructure';
import type { UpdateResult } from 'typeorm';

@Injectable()
export class Mat017ItemService {
  constructor(private readonly mat017ItemDataAccessService: Mat017ItemDataAccessService) {}

  public async searchMat017Item(
    listInformation: Mat017ItemListParameter
  ): Promise<IcalcListResult<Mat017ItemSearchResult>> {
    return this.mat017ItemDataAccessService.searchMat017Item(listInformation);
  }

  public async findManyByIds(ids: string[]): Promise<Mat017Item[]> {
    return this.mat017ItemDataAccessService.findManyByIds(ids);
  }

  public async findOneByMatNumber(matNumber: string): Promise<Mat017Item> {
    return this.mat017ItemDataAccessService.findOneByMatNumber(matNumber);
  }

  public async create(matItems: Partial<Mat017Item>[]): Promise<CreateMat017ItemManuallyResponseDto> {
    return this.mat017ItemDataAccessService.createManyTransactional(matItems);
  }

  public async removeManuallyCreatedMat017Item(matNumber: string): Promise<UpdateResult> {
    const manuallyCreatedMatItem =
      await this.mat017ItemDataAccessService.findManuallyCreatedMat017ItemByMatNumber(matNumber);

    if (!manuallyCreatedMatItem)
      throw new MethodNotAllowedException(`The manually created item with number ${matNumber} does not exist`);

    return this.mat017ItemDataAccessService.setOneToRemoved(matNumber);
  }

  public async getLatestModificationDate(): Promise<Mat017ItemsLatestModificationDate> {
    return this.mat017ItemDataAccessService.getLatestModificationDate();
  }
}
