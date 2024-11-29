import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { IerpMat017Item, IerpMat017ItemPrice, Mat017Item } from '@igus/icalc-domain';
import { Mat017ItemStatus } from '@igus/icalc-domain';
import { Mat017InfrastructureModuleLogger } from './logger.service';
import { Mat017ItemDataAccessService } from './mat017-item-data-access.service';
import { Mat017ItemUpdateService } from './mat017-item-update.service';
import { Mat017ItemUsageDataAccessService } from './mat017-item-usage-data-access.service';

const mockIerpMat017ItemPrice: IerpMat017ItemPrice = {
  matNumber: 'MAT01715393',
  supplierItemNumber: 'DYMS0722520',
  supplierId: '7300388',
  quantityAmount: 0,
  amount: 12.56,
  priceUnit: 0,
  supplierName: 'testsup',
  discountPercentage1: 0,
};

const mockIerpMat017Item: IerpMat017Item = {
  matNumber: 'MAT01715393',
  mat017ItemGroup: 'RC-D6',
  itemDescription1De: 'Werkzeug',
  itemDescription2De: 'Dymo-Etiketten 54x25mm a 500St / 11352',
  itemDescription1En: 'Werkzeug',
  itemDescription2En: 'Dymo-Etiketten 54x25mm a 500St / 11352',
  unitId: 'Stk',
  prices: [mockIerpMat017ItemPrice],
};

const mockExistingMat017Items: { [key: string]: Mat017Item } = {
  notManuallyCreatedWithoutChanges: {
    id: '1',
    matNumber: 'MAT01715393',
    mat017ItemGroup: 'RC-D6',
    itemDescription1: 'Werkzeug',
    itemDescription2: 'Dymo-Etiketten 54x25mm a 500St / 11352',
    amountDividedByPriceUnit: 12.56,
    itemStatus: Mat017ItemStatus.active,
    manuallyCreated: false,
    supplierItemNumber: 'DYMS0722520',
    supplierId: '7300388',
    amount: 12.56,
    priceUnit: 0,
  },
  notManuallyCreatedWithChanges: {
    id: '2',
    matNumber: 'MAT01715393',
    mat017ItemGroup: 'RC-K2',
    itemDescription1: 'Werkzeugkasten',
    itemDescription2: 'Dymo-Etiketten 54x25mm a 500St / 11352',
    amountDividedByPriceUnit: 0,
    itemStatus: Mat017ItemStatus.active,
  },
  manuallyCreatedWithoutChanges: {
    id: '3',
    matNumber: 'MAT01715393',
    mat017ItemGroup: 'RC-D6',
    itemDescription1: 'Werkzeug',
    itemDescription2: 'Dymo-Etiketten 54x25mm a 500St / 11352',
    manuallyCreated: true,
    amountDividedByPriceUnit: 12.56,
    itemStatus: Mat017ItemStatus.active,
    supplierItemNumber: 'DYMS0722520',
    supplierId: '7300388',
    amount: 12.56,
    priceUnit: 0,
  },
};

const basicResult: Mat017Item = {
  amount: 12.56,
  amountDividedByPriceUnit: 12.56,
  id: undefined,
  itemDescription1: 'Werkzeug',
  itemDescription2: 'Dymo-Etiketten 54x25mm a 500St / 11352',
  itemStatus: Mat017ItemStatus.active,
  manuallyCreated: false,
  mat017ItemGroup: 'RC-D6',
  matNumber: 'MAT01715393',
  priceUnit: 0,
  supplierId: '7300388',
  supplierItemNumber: 'DYMS0722520',
};

describe('Mat017ItemUpdateService', () => {
  let service: Mat017ItemUpdateService;
  let mat017ItemDataAccessService: Mat017ItemDataAccessService;
  let mat017ItemUsageDataAccessService: Mat017ItemUsageDataAccessService;
  let logger: Mat017InfrastructureModuleLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Mat017ItemUpdateService,
        {
          provide: Mat017InfrastructureModuleLogger,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: Mat017ItemDataAccessService,
          useValue: {
            createMany: jest.fn(),
            updateMany: jest.fn(),
            setManyToRemoved: jest.fn(),
            getAllMat017Items: jest.fn(),
          },
        },
        {
          provide: Mat017ItemUsageDataAccessService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<Mat017ItemUpdateService>(Mat017ItemUpdateService);
    mat017ItemDataAccessService = module.get<Mat017ItemDataAccessService>(Mat017ItemDataAccessService);
    mat017ItemUsageDataAccessService = module.get<Mat017ItemUsageDataAccessService>(Mat017ItemUsageDataAccessService);
    logger = module.get<Mat017InfrastructureModuleLogger>(Mat017InfrastructureModuleLogger);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
    expect(logger).toBeTruthy();
    expect(mat017ItemDataAccessService).toBeTruthy();
    expect(mat017ItemUsageDataAccessService).toBeTruthy();
  });

  describe('updateItemsFromIerp', () => {
    let createManySpy: jest.SpyInstance;
    let updateManySpy: jest.SpyInstance;
    let getAllMat017Items: jest.SpyInstance;
    let setManyToRemovedSpy: jest.SpyInstance;

    beforeEach(() => {
      createManySpy = jest.spyOn(mat017ItemDataAccessService, 'createMany');
      updateManySpy = jest.spyOn(mat017ItemDataAccessService, 'updateMany');
      getAllMat017Items = jest.spyOn(mat017ItemDataAccessService, 'getAllMat017Items');
      setManyToRemovedSpy = jest.spyOn(mat017ItemDataAccessService, 'setManyToRemoved');
    });

    it('should trigger createMany database operation with new items', async () => {
      getAllMat017Items.mockReturnValue([]);
      await service.updateItemsFromIerp([mockIerpMat017Item]);

      expect(createManySpy).toHaveBeenCalledWith([expect.objectContaining(basicResult)]);
      expect(updateManySpy).not.toHaveBeenCalled();
      expect(setManyToRemovedSpy).not.toHaveBeenCalled();
    });

    it('should trigger updateMany database operation when item should be updated', async () => {
      getAllMat017Items.mockReturnValue([mockExistingMat017Items.manuallyCreatedWithoutChanges]);
      await service.updateItemsFromIerp([mockIerpMat017Item]);

      expect(createManySpy).not.toHaveBeenCalled();
      expect(updateManySpy).toHaveBeenCalledWith([{ ...basicResult, id: '3' }]);
      expect(setManyToRemovedSpy).not.toHaveBeenCalled();
    });

    it('should trigger setManyToRemoved for existing items when iERP data is empty', async () => {
      const existingMat017Items = [
        {
          ...mockExistingMat017Items.notManuallyCreatedWithoutChanges,
          matNumber: '1',
        },
        {
          ...mockExistingMat017Items.notManuallyCreatedWithChanges,
          matNumber: '2',
        },
        {
          ...mockExistingMat017Items.manuallyCreatedWithoutChanges,
          matNumber: '3',
          itemStatus: Mat017ItemStatus.removed,
        },
      ];

      getAllMat017Items.mockReturnValue(existingMat017Items);
      await service.updateItemsFromIerp([]);

      expect(createManySpy).not.toHaveBeenCalled();
      expect(updateManySpy).not.toHaveBeenCalled();
      expect(setManyToRemovedSpy).toHaveBeenCalledWith(['1', '2']);
    });

    describe('no update, creation or removal', () => {
      it('should not trigger any database operation if only items with manually created flag exist and no iERP data is provided', async () => {
        getAllMat017Items.mockReturnValue([mockExistingMat017Items.manuallyCreatedWithoutChanges]);

        await service.updateItemsFromIerp([]);

        expect(createManySpy).not.toHaveBeenCalled();
        expect(updateManySpy).not.toHaveBeenCalled();
        expect(setManyToRemovedSpy).not.toHaveBeenCalled();
      });

      it('should not trigger any database operation when existing items are equal to iERP data', () => {
        getAllMat017Items.mockReturnValue([mockExistingMat017Items.notManuallyCreatedWithoutChanges]);
        service.updateItemsFromIerp([mockIerpMat017Item]);

        expect(createManySpy).not.toHaveBeenCalled();
        expect(updateManySpy).not.toHaveBeenCalled();
        expect(setManyToRemovedSpy).not.toHaveBeenCalled();
      });
    });
  });
});
