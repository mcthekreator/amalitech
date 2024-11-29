import { Injectable } from '@nestjs/common';
import { Mat017ItemDataAccessService } from './mat017-item-data-access.service';
import type {
  Mat017ImportUsage,
  Mat017ItemUsage,
  Mat017Item,
  RawMat017ItemImportBaseData,
  RawMat017ItemImportPrice,
  IerpMat017Item,
} from '@igus/icalc-domain';
import {
  getDefaultPurchasingPrice,
  Mat017ItemMappers,
  Mat017ItemImportBaseDataValidationFailureReason,
  Mat017ItemImportPriceValidationFailureReason,
  Mat017ItemUsageValidationFailureReason,
  Mat017ItemImportModelCollection,
} from '@igus/icalc-domain';
import { Mat017ItemUsageDataAccessService } from './mat017-item-usage-data-access.service';
import { Mat017InfrastructureModuleLogger } from './logger.service';

@Injectable()
export class Mat017ItemUpdateService {
  constructor(
    private mat017ItemDataAccessService: Mat017ItemDataAccessService,
    private mat017ItemUsageDataAccessService: Mat017ItemUsageDataAccessService,
    private logger: Mat017InfrastructureModuleLogger
  ) {
    this.logger.setContext('Mat017ItemUpdateService');
  }

  public async updateItemsFromCsv(
    baseData: RawMat017ItemImportBaseData[],
    prices: RawMat017ItemImportPrice[]
  ): Promise<void> {
    const importModelCollection = await this.createImportModelCollectionWithExistingItems();

    baseData.forEach((e) => importModelCollection.addBaseData(e));
    prices.forEach((e) => importModelCollection.addPrice(e));

    await this.updateItemsFromImportModel(importModelCollection);
  }

  public async updateItemsFromIerp(ierpMat017Items: IerpMat017Item[], dryRun?: boolean): Promise<void> {
    const importModelCollection = await this.createImportModelCollectionWithExistingItems();

    this.setupImportModelCollectionWithIerpMat017Items(ierpMat017Items, importModelCollection);

    await this.updateItemsFromImportModel(importModelCollection, dryRun);
  }

  public async updateUsages(importedMat017ItemUsages: Mat017ImportUsage[]): Promise<void> {
    this.logger.log('----');
    this.logger.log(`imported usages: ${importedMat017ItemUsages.length}`);

    const { validImportedUsages, invalidUsages } = this.prepareUsages(importedMat017ItemUsages);

    this.logger.log(`valid imported usages: ${validImportedUsages.length}`);
    this.logger.log(`invalid imported usages: ${invalidUsages.length}`);

    await this.triggerDatabaseOperationsForUsages(validImportedUsages);
  }

  private async updateItemsFromImportModel(
    importModelCollection: Mat017ItemImportModelCollection,
    dryRun?: boolean
  ): Promise<void> {
    this.logUpdateSummary(importModelCollection);

    if (dryRun) {
      this.logAllCandidates(importModelCollection);
      return;
    }

    await this.triggerDatabaseOperationsForItems(
      importModelCollection.getUpdateCandidates(),
      importModelCollection.getCreationCandidates(),
      importModelCollection.getRemovalCandidates()
    );
  }

  private async createImportModelCollectionWithExistingItems(): Promise<Mat017ItemImportModelCollection> {
    const importModelCollection = new Mat017ItemImportModelCollection();
    const existingItems = await this.mat017ItemDataAccessService.getAllMat017Items();

    existingItems.forEach((e) => importModelCollection.addExistingItem(e));
    return importModelCollection;
  }

  private setupImportModelCollectionWithIerpMat017Items(
    ierpMat017Items: IerpMat017Item[],
    importModelCollection: Mat017ItemImportModelCollection
  ): void {
    ierpMat017Items.forEach((ierpMat017Item) => {
      importModelCollection.addBaseData(
        Mat017ItemMappers.fromIerpMat017ItemToRawMat017ItemImportBaseData(ierpMat017Item)
      );

      // consider only default (not staggered) price
      const price = getDefaultPurchasingPrice(ierpMat017Item);

      if (price) {
        importModelCollection.addPrice(Mat017ItemMappers.fromIerpMat017ItemPriceToRawMat017ItemImportPrice(price));
      }
    });
  }

  /**
   * prepareUsages - separates valid from invalid imported usages, puts the valid ones into an array and collects invalid usages in a separate array
   *
   * @param importedMat017ItemUsages - takes unvalidated imported usages array
   * @returns array of valid usages, array of invalid usages (duplicates are invalid)
   */
  private prepareUsages(importedMat017ItemUsages: Mat017ImportUsage[]): {
    validImportedUsages: Mat017ImportUsage[];
    invalidUsages: Mat017ImportUsage[];
  } {
    const validImportedUsages: Mat017ImportUsage[] = [];
    const invalidUsages = [];
    let faultyMatNumberUsages = 0;
    let faultyChainflexPartNumberUsages = 0;
    let faultyBomIdUsages = 0;

    importedMat017ItemUsages.forEach((importedUsage) => {
      const validationResult = this.isUsageValid(importedUsage);

      if (validationResult.isValid) {
        validImportedUsages.push(importedUsage);
      } else {
        invalidUsages.push(importedUsage);

        if (validationResult.reasons.includes(Mat017ItemUsageValidationFailureReason.matNumber)) {
          faultyMatNumberUsages++;
        }

        if (validationResult.reasons.includes(Mat017ItemUsageValidationFailureReason.chainflexPartNumber)) {
          faultyChainflexPartNumberUsages++;
        }

        if (validationResult.reasons.includes(Mat017ItemUsageValidationFailureReason.bomId)) {
          faultyBomIdUsages++;
        }
      }
    });

    if (invalidUsages.length > 0) {
      this.logger.log(`usages - invalid mat number: ${faultyMatNumberUsages}`);
      this.logger.log(`usages - invalid chainflexPartNumber: ${faultyChainflexPartNumberUsages}`);
      this.logger.log(`usages - invalid bomId: ${faultyBomIdUsages}`);
    }

    return {
      validImportedUsages,
      invalidUsages,
    };
  }

  private isUsageValid(mat017ItemUsage: Mat017ImportUsage): { isValid: boolean; reasons: string[] } {
    const result = {
      isValid: true,
      reasons: [],
    };

    const { matNumber, chainFlexPartNumber, bomId } = mat017ItemUsage;

    if (!matNumber) {
      result.isValid = false;
      result.reasons.push(Mat017ItemUsageValidationFailureReason.matNumber);
    }

    if (!chainFlexPartNumber) {
      result.isValid = false;
      result.reasons.push(Mat017ItemUsageValidationFailureReason.chainflexPartNumber);
    }

    if (!bomId) {
      result.isValid = false;
      result.reasons.push(Mat017ItemUsageValidationFailureReason.bomId);
    }

    return result;
  }

  private logUpdateSummary(importModelCollection: Mat017ItemImportModelCollection): void {
    this.logger.log('----');
    this.logger.log(`MAT017 base data item count: ${importModelCollection.getBaseDataCount()}`);
    this.logger.log(`MAT017 price item count: ${importModelCollection.getPricesCount()}`);
    this.logger.log(`MAT017 existing item count: ${importModelCollection.getExistingItemCount()}`);
    this.logger.log(`all items: ${importModelCollection.getItemCount()}`);

    const invalidItemCount = importModelCollection.getNewInvalidItemCount();

    if (invalidItemCount > 0) {
      this.logger.log('----');
      this.logger.log(`total invalid items: ${importModelCollection.getNewInvalidItemCount()}`);
      this.logger.log(
        `invalid itemDescription1: ${importModelCollection.getMat017ItemImportBaseDataValidationFailureReasonCount(
          Mat017ItemImportBaseDataValidationFailureReason.itemDescription1
        )}`
      );
      this.logger.log(
        `invalid mat017ItemGroup: ${importModelCollection.getMat017ItemImportBaseDataValidationFailureReasonCount(
          Mat017ItemImportBaseDataValidationFailureReason.mat017ItemGroup
        )}`
      );
      this.logger.log(
        `invalid priceUnit: ${importModelCollection.getMat017ItemImportPriceValidationFailureReasonCount(
          Mat017ItemImportPriceValidationFailureReason.priceUnit
        )}`
      );
      this.logger.log(
        `invalid amount: ${importModelCollection.getMat017ItemImportPriceValidationFailureReasonCount(
          Mat017ItemImportPriceValidationFailureReason.amount
        )}`
      );
    }

    this.logger.log('----');
    this.logger.log(`number of update candidates: ${importModelCollection.getUpdateCandidates().length}`);
    this.logger.log(`number of creation candidates: ${importModelCollection.getCreationCandidates().length}`);
    this.logger.log(`number of "removal" candidates: ${importModelCollection.getRemovalCandidates().length}`);
  }

  private logAllCandidates(importModelCollection: Mat017ItemImportModelCollection): void {
    this.logger.log('----');
    const updateCandidates = importModelCollection.getUpdateCandidates();
    const creationCandidates = importModelCollection.getCreationCandidates();
    const removalCandidates = importModelCollection.getRemovalCandidates();

    if (updateCandidates.length > 0) {
      this.logger.log('update candidates:');
      importModelCollection.getUpdateCandidates().forEach(console.log);
    }

    if (creationCandidates.length > 0) {
      this.logger.log('creation candidates:');
      importModelCollection.getCreationCandidates().forEach(console.log);
    }

    if (removalCandidates.length > 0) {
      this.logger.log('"removal" candidates:');
      importModelCollection.getRemovalCandidates().forEach(console.log);
    }
  }

  private async triggerDatabaseOperationsForItems(
    preparedItemsForUpdate: Mat017Item[],
    preparedItemsForCreation: Mat017Item[],
    preparedItemIdsForDeletion: string[]
  ): Promise<void> {
    if (preparedItemsForUpdate.length > 0) {
      try {
        const updatedItems = await this.mat017ItemDataAccessService.updateMany(preparedItemsForUpdate);

        this.logger.log(`updated items: ${updatedItems.length}`);
      } catch (error) {
        this.logger.error(`error during batch update: ${error}`);
      }
    }

    if (preparedItemsForCreation.length > 0) {
      try {
        const createdItems = await this.mat017ItemDataAccessService.createMany(preparedItemsForCreation);

        this.logger.log(`created items: ${createdItems.length}`);
      } catch (error) {
        this.logger.error(`error during batch creation: ${error}`);
      }
    }

    if (preparedItemIdsForDeletion.length > 0) {
      try {
        const updateResult = await this.mat017ItemDataAccessService.setManyToRemoved(preparedItemIdsForDeletion);

        this.logger.log(`itemStatus set to "removed": ${updateResult.affected}`);
      } catch (error) {
        this.logger.error(`error during setting of itemStatus "removed": ${error}`);
      }
    }
  }

  private async triggerDatabaseOperationsForUsages(validImportedUsages: Mat017ImportUsage[]): Promise<void> {
    try {
      await this.mat017ItemUsageDataAccessService.clear();

      this.logger.log('mat017_item_usages table cleared');
    } catch (error) {
      this.logger.error(`error during clearing of mat017_item_usages: ${error}`);
    }

    try {
      const createdUsages = await this.mat017ItemUsageDataAccessService.createMany(
        validImportedUsages as Mat017ItemUsage[]
      );

      this.logger.log(`created usages: ${createdUsages.length}`);
    } catch (error) {
      this.logger.error(`error during batch creation of usages: ${error}`);
    }
  }
}
