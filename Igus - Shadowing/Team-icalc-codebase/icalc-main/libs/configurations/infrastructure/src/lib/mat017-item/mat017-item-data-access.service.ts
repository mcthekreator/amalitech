import type {
  Configuration,
  IcalcListResult,
  Mat017Item,
  Mat017ItemListFilter,
  Mat017ItemListParameter,
  Mat017ItemsBaseDataMap,
  Mat017ItemSearchResult,
  Mat017ItemsLatestModificationDate,
} from '@igus/icalc-domain';
import {
  defaultIcalcListInformation,
  getUniqueMatNumbersOfMat017ItemsFromConfigurations,
  Mat017ItemStatus,
} from '@igus/icalc-domain';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DATABASE_CHUNK_SIZE, ICALC_CONNECTION } from '@igus/icalc-common';
import type { DeleteResult, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { DataSource, EntityManager, ILike, In, Repository } from 'typeorm';
import { Mat017ItemEntity } from '@igus/icalc-entities';
import { Mat017ItemDbResult } from './mat017-item-db-result';

@Injectable()
export class Mat017ItemDataAccessService {
  private readonly columnMap = {
    matNumber: 'mat_number',
    score: 'dynamic_score',
    itemDescription1: 'item_description_1',
    itemDescription2: 'item_description_2',
    mat017ItemGroup: 'mat017_item_group',
    supplierItemNumber: 'supplier_item_number',
    price: 'amount_divided_by_price_unit',
  };

  constructor(
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource,
    @InjectRepository(Mat017ItemEntity, ICALC_CONNECTION)
    private readonly mat017ItemRepository: Repository<Mat017Item>
  ) {}

  public async searchMat017Item(
    listInformation: Mat017ItemListParameter
  ): Promise<IcalcListResult<Mat017ItemSearchResult>> {
    if (!listInformation.partNumber) {
      throw new HttpException('Parameter error: part number is missing', HttpStatus.BAD_REQUEST);
    }
    const { listParameter, listOrder } = this.prepareListParametersAndListOrder(listInformation);

    const mainQueryBuilder = this.getMat017ItemQueryBuilder(listParameter);
    const searchedMainQueryBuilder = this.applySearchConditions(mainQueryBuilder, listParameter.search);
    const filteredMainQueryBuilder = this.applyFilterConditions(searchedMainQueryBuilder, listParameter);

    const totalCount = await this.getTotalCount(filteredMainQueryBuilder);

    const mappedMat017ItemResult = await this.getMat017ItemSearchResult(
      filteredMainQueryBuilder,
      listOrder,
      listParameter
    );

    return {
      data: mappedMat017ItemResult,
      totalCount,
      listParameter,
    };
  }

  public async getAllMat017Items(): Promise<Mat017Item[]> {
    return this.mat017ItemRepository.find();
  }

  public async createMany(mat017Items: Mat017Item[]): Promise<Mat017Item[]> {
    return this.mat017ItemRepository.save(mat017Items, { chunk: DATABASE_CHUNK_SIZE });
  }

  public async updateMany(mat017Items: Mat017Item[]): Promise<Mat017Item[]> {
    return this.mat017ItemRepository.save(mat017Items, { chunk: DATABASE_CHUNK_SIZE });
  }

  public async setManyToRemoved(mat017ItemIds: string[]): Promise<UpdateResult> {
    return this.dataSource
      .createQueryBuilder()
      .update(Mat017ItemEntity)
      .set({
        itemStatus: Mat017ItemStatus.removed,
      })
      .where({ id: In(mat017ItemIds) })
      .execute();
  }

  public async setOneToRemoved(matNumber: string): Promise<UpdateResult> {
    return this.dataSource
      .createQueryBuilder()
      .update(Mat017ItemEntity)
      .set({
        itemStatus: Mat017ItemStatus.removed,
      })
      .where({ matNumber })
      .execute();
  }

  public async findManyByIds(ids: string[]): Promise<Mat017Item[]> {
    return await this.mat017ItemRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  public async findOneByMatNumber(matNumber: string): Promise<Mat017Item> {
    return await this.mat017ItemRepository.findOne({
      where: {
        matNumber,
        itemStatus: In([Mat017ItemStatus.active, Mat017ItemStatus.inactive]),
      },
    });
  }

  public async findManyByMatNumbers(matNumbers: string[]): Promise<Mat017Item[]> {
    return await this.mat017ItemRepository.find({
      where: {
        matNumber: In(matNumbers),
      },
    });
  }

  public async findManuallyCreatedMat017ItemByMatNumber(matNumber: string): Promise<Mat017Item> {
    return this.mat017ItemRepository.findOne({
      where: {
        matNumber,
        manuallyCreated: true,
      },
    });
  }

  public async generateMat017ItemBaseDataMap(configurations: Configuration[]): Promise<Mat017ItemsBaseDataMap> {
    const mat017ItemsInAllConfigurations = getUniqueMatNumbersOfMat017ItemsFromConfigurations(configurations);
    const latestMat017ItemBaseData = await this.findManyByMatNumbers(mat017ItemsInAllConfigurations);

    return latestMat017ItemBaseData.reduce((acc, mat017Item: Mat017Item) => {
      return acc.set(mat017Item.matNumber, mat017Item);
    }, new Map<string, Mat017Item>());
  }

  public saveOne(mat017Item: Mat017Item): Promise<Mat017Item> {
    return this.mat017ItemRepository.save(mat017Item);
  }

  public async deleteManyWithPrefix(prefix: string): Promise<DeleteResult> {
    return this.mat017ItemRepository.delete({ matNumber: ILike(`${prefix}%`) });
  }

  public async getLatestModificationDate(): Promise<Mat017ItemsLatestModificationDate> {
    return this.dataSource
      .createQueryBuilder()
      .select('MAX(item.modification_date)', 'latestModificationDate')
      .from(Mat017ItemEntity, 'item')
      .getRawOne();
  }

  public async createManyTransactional(matItems: Partial<Mat017Item>[]): Promise<Mat017Item[]> {
    return this.dataSource.transaction((transactionalEntityManager) => {
      return this.deleteAndRecreateManuallyCreatedItems(transactionalEntityManager, matItems);
    });
  }

  private async deleteAndRecreateManuallyCreatedItems(
    transactionalEntityManager: EntityManager,
    matItems: Partial<Mat017Item>[]
  ): Promise<Mat017Item[]> {
    const itemsToDelete = matItems.map((matItem) => matItem.matNumber);

    await transactionalEntityManager.delete(Mat017ItemEntity, {
      matNumber: In(itemsToDelete),
      itemStatus: Mat017ItemStatus.removed,
    });

    const insertResults: Mat017Item[] = await transactionalEntityManager.save(Mat017ItemEntity, matItems, {
      chunk: DATABASE_CHUNK_SIZE,
    });

    const creationItemsCount = matItems.length;
    const insertedItemsCount = insertResults.length;

    if (insertedItemsCount < creationItemsCount) {
      throw new InternalServerErrorException(
        `numbers of created items (${insertedItemsCount}) is not equal to number of items to create (${creationItemsCount})`
      );
    }
    return insertResults;
  }

  private async getMat017ItemSearchResult(
    filteredMainQueryBuilder: SelectQueryBuilder<unknown>,
    listOrder: { orderBy: string; orderDirection: string },
    listParameter: Mat017ItemListParameter
  ): Promise<Mat017ItemSearchResult[]> {
    const filteredAndOrderedQueryBuilder = filteredMainQueryBuilder
      .orderBy(listOrder.orderBy, listOrder.orderDirection.toUpperCase() as 'DESC' | 'ASC')
      .offset(listParameter.skip)
      .limit(listParameter.take);

    const data = await filteredAndOrderedQueryBuilder.getRawMany<Mat017ItemDbResult>();

    return this.mapMat017ItemResult(data);
  }

  private async getTotalCount(filteredMainQueryBuilder: SelectQueryBuilder<unknown>): Promise<number> {
    const countQueryResult: { count: number } = await this.dataSource
      .createQueryBuilder()
      .select('count(mat_items.mat_number)')
      .from(`( ${filteredMainQueryBuilder.getQuery()} )`, 'mat_items')
      .getRawOne();
    const countResultNumber = +countQueryResult.count;

    return isNaN(countResultNumber) ? 0 : countResultNumber;
  }

  private getMat017ItemQueryBuilder(listParameter: Mat017ItemListParameter): SelectQueryBuilder<unknown> {
    const matNumberCountQuery = this.getMatNumberCountQuery(listParameter);

    return this.dataSource
      .createQueryBuilder()
      .select('mat017_item.*')
      .addSelect('coalesce(score.score, 0)', 'dynamic_score')
      .from('mat017_item', 'mat017_item')
      .leftJoin(`( ${matNumberCountQuery} )`, 'score', 'score.mat_number = mat017_item.mat_number')
      .where(`mat017_item.item_status != '${Mat017ItemStatus.removed}'`);
  }

  private prepareListParametersAndListOrder(listInformation: Mat017ItemListParameter): {
    listParameter: Mat017ItemListParameter;
    listOrder: { orderBy: string; orderDirection: string };
  } {
    return {
      listParameter: {
        ...defaultIcalcListInformation,
        ...listInformation,
        showZeroMatches: `${listInformation.showZeroMatches}` === 'true',
        showOnlyManuallyCreated: `${listInformation.showOnlyManuallyCreated}` === 'true',
      },
      listOrder: {
        orderBy: this.columnMap[listInformation.orderBy] || 'dynamic_score',
        orderDirection: listInformation.orderDirection ?? 'DESC',
      },
    };
  }

  private getMatNumberCountQuery(listParameter: Mat017ItemListParameter): string {
    const filterAmountQueryBuilder = this.getFilterAmountQuery(listParameter);

    return this.dataSource
      .createQueryBuilder()
      .select('item_usages.mat_number')
      .addSelect('count(DISTINCT item_usages.bom_id)', 'score')
      .from('mat017_item_usages', 'item_usages')
      .where(`item_usages.part_number = '${listParameter.partNumber}'`)
      .andWhere(`item_usages.bom_id IN ( ${filterAmountQueryBuilder} )`)
      .groupBy('item_usages.mat_number')
      .getQuery();
  }

  private getFilterAmountQuery(listParameter: Mat017ItemListParameter): string {
    const scoreAmountQuery = this.getScoreAmountQuery(listParameter);

    return this.dataSource
      .createQueryBuilder()
      .select('item_usages_sub.bom_id', 'bom_id')
      .select('filter_usage.bom_id', 'bom_id')
      .from('(' + scoreAmountQuery + ')', 'filter_usage')
      .getQuery();
  }

  private getScoreAmountQuery(listParameter: Mat017ItemListParameter): string {
    let items = listParameter.items;

    if (typeof items === 'string') {
      items = [items];
    }
    let scoreAmountQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select('item_usages_sub.bom_id', 'bom_id')
      .addSelect('count(DISTINCT item_usages_sub.mat_number)', 'c')
      .from('mat017_item_usages', 'item_usages_sub')
      .where(`item_usages_sub.part_number = '${listParameter.partNumber}'`);

    if (items?.length > 0) {
      scoreAmountQueryBuilder = scoreAmountQueryBuilder.andWhere(
        `item_usages_sub.mat_number IN ('${items.join(`', '`)}')`
      );
    }
    return scoreAmountQueryBuilder
      .groupBy('item_usages_sub.bom_id')
      .having(`count(DISTINCT item_usages_sub.mat_number) >= ${items?.length || 0}`)
      .getQuery();
  }

  private applyFilterConditions(
    filteredMainQueryBuilder: SelectQueryBuilder<unknown>,
    filter: Mat017ItemListFilter
  ): SelectQueryBuilder<unknown> {
    if (filter.showOnlyManuallyCreated) {
      filteredMainQueryBuilder = filteredMainQueryBuilder.andWhere('mat017_item.manually_created = true');
    }
    if (!filter.showZeroMatches) {
      filteredMainQueryBuilder = this.dataSource
        .createQueryBuilder()
        .select('filtered.*')
        .from(`( ${filteredMainQueryBuilder.getQuery()} )`, 'filtered')
        .where('filtered.dynamic_score > 0');
    }
    return filteredMainQueryBuilder;
  }

  private applySearchConditions(query: SelectQueryBuilder<unknown>, searchString: string): SelectQueryBuilder<unknown> {
    if (searchString) {
      query = query.andWhere(
        `(mat017_item.mat_number ilike '%${searchString}%' or mat017_item.item_description_1 ilike '%${searchString}%' or mat017_item.item_description_2 ilike '%${searchString}%' or mat017_item.supplier_item_number ilike '%${searchString}%')`
      );
    }
    return query;
  }

  private mapMat017ItemResult(items: Mat017ItemDbResult[]): Mat017ItemSearchResult[] {
    return items.map((item) => ({
      id: item.id,
      matNumber: item.mat_number,
      score: +item.dynamic_score,
      itemDescription1: item.item_description_1,
      itemDescription2: item.item_description_2,
      mat017ItemGroup: item.mat017_item_group,
      supplierItemNumber: item.supplier_item_number,
      supplierId: item.supplier_id,
      itemStatus: item.item_status,
      modificationDate: item.modification_date,
      amountDividedByPriceUnit: item.amount_divided_by_price_unit,
      manuallyCreated: item.manually_created,
    }));
  }
}
