import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, switchMap, throwError } from 'rxjs';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError, AxiosHeaders } from 'axios';
import type { IerpMat017Item, IerpMat017ItemUsage, IerpPaginatedResult } from '@igus/icalc-domain';
import { Mat017ItemIerpService } from './mat017-item-ierp.service';
import { Mat017InfrastructureModuleLogger } from './logger.service';

const mockIerpMat017Item: IerpMat017Item = {
  matNumber: 'MAT01715393',
  mat017ItemGroup: 'RC-D6',
  itemDescription1De: 'Werkzeug',
  itemDescription2De: 'Dymo-Etiketten 54x25mm a 500St / 11352',
  itemDescription1En: '',
  itemDescription2En: '',
  unitId: 'Stk',
  prices: [
    {
      matNumber: 'MAT01715393',
      supplierItemNumber: 'DYMS0722520',
      supplierId: '7300388',
      priceUnit: 0,
      amount: 12.56,
      quantityAmount: 0,
      supplierName: 'TEST',
      discountPercentage1: 0,
    },
  ],
};

const secondMockIerpMat017Item: IerpMat017Item = {
  matNumber: 'MAT0172426',
  mat017ItemGroup: 'RC-K7',
  itemDescription1De: 'Dichteinsatz',
  itemDescription2De: 'HSK-ME, PG42,-ohne Bohrung-',
  itemDescription1En: '',
  itemDescription2En: '',
  unitId: 'Stk',
  prices: [
    {
      matNumber: 'MAT0172426',
      supplierItemNumber: 'DYMS0722520',
      supplierId: '7300388',
      priceUnit: 100,
      amount: 147.56,
      quantityAmount: 0,
      supplierName: 'TEST',
      discountPercentage1: 0,
    },
  ],
};

const thirdMockIerpMat017Item: IerpMat017Item = {
  matNumber: 'MAT01748984',
  mat017ItemGroup: 'RC-L2',
  itemDescription1De: 'Dichteinsatz',
  itemDescription2De: 'HSK-ME, PG42,-ohne Bohrung-',
  itemDescription1En: '',
  itemDescription2En: '',
  unitId: 'Stk',
  prices: [
    {
      matNumber: 'MAT01748984',
      supplierItemNumber: 'DYMS0722520',
      supplierId: '7300388',
      priceUnit: 100,
      amount: 147.56,
      quantityAmount: 0,
      supplierName: 'TEST',
      discountPercentage1: 0,
    },
  ],
};

const defaultAxiosConfig: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };

const firstMockUsage: IerpMat017ItemUsage = {
  partNumber: 'CFLK.L1.02',
  bomId: 'MAT90411706',
  matNumber: 'MAT0170001',
};

const secondMockUsage: IerpMat017ItemUsage = {
  partNumber: 'CF77.UL.05.04.D',
  bomId: 'MAT904104514_V2',
  matNumber: 'MAT0170002',
};

const createSuccessfulPaginatedResponse = <T>(data: IerpPaginatedResult<T>): AxiosResponse<IerpPaginatedResult<T>> => {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { ...defaultAxiosConfig },
  };
};

describe('Mat017ItemIerpService', () => {
  let service: Mat017ItemIerpService;
  let httpService: HttpService;
  let logger: Mat017InfrastructureModuleLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Mat017ItemIerpService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: Mat017InfrastructureModuleLogger,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<Mat017ItemIerpService>(Mat017ItemIerpService);
    service.setConfig({ retryDelay: 1 });
    httpService = module.get<HttpService>(HttpService);
    logger = module.get<Mat017InfrastructureModuleLogger>(Mat017InfrastructureModuleLogger);
  });

  describe('setConfig', () => {
    it('should be able to set response timeout', async () => {
      const timeoutUnderTest = 100;
      const response: AxiosResponse<IerpMat017Item> = {
        data: { ...mockIerpMat017Item },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { ...defaultAxiosConfig },
      };

      service.setConfig({ responseTimeout: timeoutUnderTest });

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

      await service.getMat017Item(mockIerpMat017Item.matNumber);

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          timeout: timeoutUnderTest,
        })
      );
    });

    it('should be able to set retry count', async () => {
      const retryCountUnderTest = 100;
      const response: AxiosResponse<IerpMat017Item> = {
        data: { ...mockIerpMat017Item },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { ...defaultAxiosConfig },
      };

      service.setConfig({ retryCount: retryCountUnderTest });

      jest.spyOn(service, 'getConfig');

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

      await service.getMat017Item(mockIerpMat017Item.matNumber);

      expect(service.getConfig).toHaveBeenCalled();
      expect(service.getConfig).toHaveReturnedWith(
        expect.objectContaining({
          retryCount: retryCountUnderTest,
        })
      );
    });
  });

  describe('getAllMat017Items', () => {
    it('should handle response with only one page', async () => {
      const successResponse = createSuccessfulPaginatedResponse<IerpMat017Item>({
        data: [mockIerpMat017Item],
        pageNumber: 1,
        pageSize: 10,
        nextPage: null,
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(successResponse));

      const result = await service.getAllMat017Items();

      expect(result[0].matNumber).toEqual(mockIerpMat017Item.matNumber);
      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Fetched 1 items.'));
    });

    it('should be able to set custom pageSize', async () => {
      const pageSizeUnderTest = 100;
      const successResponse = createSuccessfulPaginatedResponse<IerpMat017Item>({
        data: [mockIerpMat017Item],
        pageNumber: 1,
        pageSize: pageSizeUnderTest,
        nextPage: null,
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(successResponse));

      await service.getAllMat017Items(pageSizeUnderTest);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining(`pageSize=${pageSizeUnderTest}`),
        expect.anything()
      );
    });

    it('should fetch Mat017Items and handle response with many pages', async () => {
      const firstPageResponse = createSuccessfulPaginatedResponse<IerpMat017Item>({
        data: [mockIerpMat017Item],
        pageNumber: 1,
        pageSize: 10,
        nextPage: 'http://api.test.com?page=2',
      });
      const secondPageResponse = createSuccessfulPaginatedResponse<IerpMat017Item>({
        data: [secondMockIerpMat017Item],
        pageNumber: 1,
        pageSize: 10,
        nextPage: 'http://api.test.com?page=3',
      });
      const thridPageResponse = createSuccessfulPaginatedResponse<IerpMat017Item>({
        data: [thirdMockIerpMat017Item],
        pageNumber: 1,
        pageSize: 10,
        nextPage: null,
      });

      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of(firstPageResponse))
        .mockReturnValueOnce(of(secondPageResponse))
        .mockReturnValueOnce(of(thridPageResponse));

      const result = await service.getAllMat017Items();

      expect(result[0]).toEqual(mockIerpMat017Item);
      expect(result[1]).toEqual(secondMockIerpMat017Item);
      expect(result[2]).toEqual(thirdMockIerpMat017Item);
      expect(logger.log).toHaveBeenCalledTimes(4); // in case of no errors there is one log per page and the final log
      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Fetched 3 items.'));
    });

    it('should retry three times and then fail', async () => {
      const failures = 4;
      const mockError = new AxiosError('Network Failure', '500', { url: '', headers: new AxiosHeaders() });

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return throwError(() => mockError);
      });

      try {
        await service.getAllMat017Items();
      } catch (error) {
        expect(error).toHaveProperty('message', 'Network Failure');
      }
      expect(logger.error).toHaveBeenCalledTimes(failures);
    });

    it('should retry three times and then succeed', async () => {
      const failures = 3;
      const mockError = new AxiosError('Network Failure', '500', { url: '', headers: new AxiosHeaders() });
      let subscriptionCount = 0;

      const successResponse: AxiosResponse<IerpPaginatedResult<IerpMat017Item>> = {
        data: { data: [mockIerpMat017Item], pageNumber: 1, pageSize: 10, nextPage: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { ...defaultAxiosConfig },
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        return of(null).pipe(
          switchMap(() => {
            subscriptionCount++;
            return subscriptionCount > failures ? of(successResponse) : throwError(() => mockError);
          })
        );
      });

      const result = await service.getAllMat017Items();

      expect(result).toHaveLength(1);
      expect(subscriptionCount).toBe(failures + 1); // number of total subscriptions include all retries plus the successful call
      expect(logger.error).toHaveBeenCalledTimes(failures);
    });
  });

  describe('getAllMat017ItemsUsages', () => {
    it('should fetch usages and handle paginated responses', async () => {
      const firstPageResponse = createSuccessfulPaginatedResponse<IerpMat017ItemUsage>({
        data: [firstMockUsage],
        pageNumber: 1,
        pageSize: 10,
        nextPage: 'http://api.test.com?page=2',
      });
      const secondPageResponse = createSuccessfulPaginatedResponse<IerpMat017ItemUsage>({
        data: [secondMockUsage],
        pageNumber: 1,
        pageSize: 10,
        nextPage: null,
      });

      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of(firstPageResponse))
        .mockReturnValueOnce(of(secondPageResponse));

      const result = await service.getAllMat017ItemsUsages();

      expect(result[0]).toEqual(firstMockUsage);
      expect(result[1]).toEqual(secondMockUsage);
      expect(logger.log).toHaveBeenCalledTimes(3);
      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Fetched 2 items.'));
    });

    it('should be able to set custom pageSize', async () => {
      const pageSizeUnderTest = 100;
      const successResponse = createSuccessfulPaginatedResponse<IerpMat017ItemUsage>({
        data: [firstMockUsage],
        pageNumber: 1,
        pageSize: 10,
        nextPage: null,
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(successResponse));

      await service.getAllMat017Items(pageSizeUnderTest);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining(`pageSize=${pageSizeUnderTest}`),
        expect.anything()
      );
    });
  });

  describe('getMat017Item', () => {
    it('should fetch one Mat017Item', async () => {
      const response: AxiosResponse<IerpMat017Item> = {
        data: { ...mockIerpMat017Item },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

      const result = await service.getMat017Item(mockIerpMat017Item.matNumber);

      expect(result).toEqual(mockIerpMat017Item);
      expect(logger.log).toHaveBeenCalledTimes(2);
    });

    it('should retry 3 times and then fail', async () => {
      const failures = 4;
      const mockError = new AxiosError('Network Failure', '500', { url: '', headers: new AxiosHeaders() });

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return throwError(() => mockError);
      });

      try {
        await service.getMat017Item(mockIerpMat017Item.matNumber);
      } catch (error) {
        expect(error).toHaveProperty('message', 'Network Failure');
      }
      expect(logger.error).toHaveBeenCalledTimes(failures);
    });

    it('should retry 3 times and then succeed', async () => {
      const failures = 3;
      const mockError = new AxiosError('Network Failure', '500', { url: '', headers: new AxiosHeaders() });
      let subscriptionCount = 0;

      const successResponse: AxiosResponse<IerpMat017Item> = {
        data: { ...mockIerpMat017Item },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        return of(null).pipe(
          switchMap(() => {
            subscriptionCount++;
            return subscriptionCount > failures ? of(successResponse) : throwError(() => mockError);
          })
        );
      });

      const result = await service.getMat017Item(mockIerpMat017Item.matNumber);

      expect(result).toEqual(mockIerpMat017Item);
      expect(subscriptionCount).toBe(failures + 1); // number of total subscriptions include all retries plus the successful call
      expect(logger.error).toHaveBeenCalledTimes(failures);
    });
  });
});
