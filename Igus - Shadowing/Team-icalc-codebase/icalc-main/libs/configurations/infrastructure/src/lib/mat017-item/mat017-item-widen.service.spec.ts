import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import type { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import type { Observable } from 'rxjs';
import { of, throwError } from 'rxjs';
import { ICALC_DYNAMIC_MAT_NUMBER_PREFIX, type WidenData, type WidenUploadImage } from '@igus/icalc-domain';
import { InternalServerErrorException } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Mat017ItemWidenService } from './mat017-item-widen.service';
import { Mat017InfrastructureModuleLogger } from './logger.service';

describe('Mat017ItemWidenService', () => {
  let testSubject: Mat017ItemWidenService;
  let axiosMock: jest.Mocked<HttpService>;

  let getMock: unknown;

  let axiosGETResponseMock: Observable<AxiosResponse<Promise<WidenData>>>;
  let axiosGETRequest: (_: string, __: AxiosRequestConfig) => Observable<AxiosResponse<Promise<WidenData>>>;

  let axiosPOSTResponseMock: Observable<AxiosResponse<Promise<unknown>>>;
  let axiosPOSTRequest: (_: string, __: AxiosRequestConfig) => Observable<AxiosResponse<Promise<unknown>>>;

  beforeEach(async () => {
    axiosGETRequest = (_, __) => axiosGETResponseMock;
    axiosPOSTRequest = (_, __) => axiosPOSTResponseMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Mat017ItemWidenService,
        {
          provide: HttpService,
          useValue: {
            get: axiosGETRequest,
            post: axiosPOSTRequest,
          },
        },
        Mat017InfrastructureModuleLogger,
      ],
    }).compile();

    testSubject = module.get<Mat017ItemWidenService>(Mat017ItemWidenService);
    axiosMock = module.get(HttpService);
    getMock = jest.spyOn(axiosMock, 'get');
  });

  afterEach(() => {
    jest.resetModules();
    axiosGETResponseMock = undefined;
    axiosPOSTResponseMock = undefined;
  });

  describe('getImagesFromWiden', () => {
    it('should fetch data from widen, when service is called', async () => {
      //given
      const mockResponse: AxiosResponse<any> = {
        data: { example: 'data' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };
      const testMatNumber = 'MAT012345';
      const params = {
        query: `productid:(${testMatNumber})`,
        expand: 'metadata,embeds',
        limit: '100',
      };

      axiosGETResponseMock = of(mockResponse);

      // when
      const result = await testSubject.getImagesFromWiden(testMatNumber);

      // then
      expect(getMock).toHaveBeenCalledWith(getEnvironment().widen.searchUrl, expect.objectContaining({ params }));

      expect(result).toEqual(mockResponse.data);
    });

    it('should throw InternalServerError when request to widen fails', async () => {
      // given
      axiosGETRequest = () => {
        throw new Error('request failed');
      };

      // when
      try {
        await testSubject.getImagesFromWiden('');
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('download request to widen resulted in an error, please try again later');
      }
    });
  });

  describe('uploadImageToWiden', () => {
    let postMock: unknown;
    const getImageSuccessfulResponseMock: AxiosResponse<any> = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      data: { status: { upload_progress: 'complete' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    beforeEach(() => {
      postMock = jest.spyOn(axiosMock, 'post');
    });

    it('should throw InternalServerErrorException when data is not defined', async () => {
      // when
      try {
        await testSubject.uploadImageToWiden([], undefined);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });

    it('should make request with returned url to get uploaded image and throw InternalServerError when get uploaded image request fails', async () => {
      // given
      const fileToUpload: Express.Multer.File = {
        fieldname: 'name',
        filename: 'name',
        originalname: 'name',
        encoding: 'img/png',
        mimetype: 'm',
        size: 1,
        stream: null,
        buffer: Buffer.from('string'),
        destination: null,
        path: '/something',
      };
      const updateRequest: WidenUploadImage = {
        file: new File([''], 'testfile', { type: 'png' }),
        matNumber: 'MAT12345',
        filename: 'testfile',
        description: '',
        titleTag: 'photo',
      };
      const updateResponseMock: AxiosResponse = {
        data: { _links: { self: 'testLink' } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosPOSTResponseMock = of(updateResponseMock);
      axiosGETResponseMock = throwError(() => new Error('request failed'));

      // when
      try {
        await testSubject.uploadImageToWiden([fileToUpload], updateRequest);
      } catch (error) {
        //then
        expect(postMock).toHaveBeenCalledWith(getEnvironment().widen.uploadUrl, expect.any(Object), expect.anything());
        expect(getMock).toHaveBeenCalledWith(
          updateResponseMock.data._links.self,
          expect.objectContaining({ params: { expand: 'embeds,status' }, headers: expect.any(Object) })
        );
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    }, 16000);

    it('should make request with returned url when image is uploaded and return result data', async () => {
      // given
      const fileToUpload: Express.Multer.File = {
        fieldname: 'name',
        filename: 'name',
        originalname: 'name',
        encoding: 'img/png',
        mimetype: 'm',
        size: 1,
        stream: null,
        buffer: Buffer.from('string'),
        destination: null,
        path: '/something',
      };
      const updateRequest: WidenUploadImage = {
        file: new File([''], 'testfile', { type: 'png' }),
        matNumber: 'MAT12345',
        filename: 'testfile',
        description: '',
        titleTag: 'photo',
      };
      const updateResponseMock: AxiosResponse<any> = {
        data: { _links: { self: 'testLink' } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      axiosPOSTResponseMock = of(updateResponseMock);
      axiosGETResponseMock = of(getImageSuccessfulResponseMock);

      // when
      const result = await testSubject.uploadImageToWiden([fileToUpload], updateRequest);

      //then
      expect(postMock).toHaveBeenCalledWith(getEnvironment().widen.uploadUrl, expect.any(Object), expect.anything());
      expect(result).toBe(updateResponseMock.data._links.self);
    });

    it('should make request with returned url when image is uploaded and return result data after one request with incomplete upload', async () => {
      // given
      const fileToUpload: Express.Multer.File = {
        fieldname: 'name',
        filename: 'name',
        originalname: 'name',
        encoding: 'img/png',
        mimetype: 'm',
        size: 1,
        stream: null,
        buffer: Buffer.from('string'),
        destination: null,
        path: '/something',
      };
      const updateRequest: WidenUploadImage = {
        file: new File([''], 'testfile', { type: 'png' }),
        matNumber: 'MAT12345',
        filename: 'testfile',
        description: '',
        titleTag: 'photo',
      };
      const updateResponseMock: AxiosResponse<any> = {
        data: { _links: { self: 'testLink' } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      const getImageUnsuccessfulResponseMock: AxiosResponse = {
        ...getImageSuccessfulResponseMock,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        data: { status: { upload_progress: 'incomplete' } },
      };

      axiosPOSTResponseMock = of(updateResponseMock);
      axiosGETResponseMock = of(getImageUnsuccessfulResponseMock).pipe(
        tap(() => {
          console.log('changed response');
          axiosGETResponseMock = of(getImageSuccessfulResponseMock);
        })
      );

      //when
      const result = await testSubject.uploadImageToWiden([fileToUpload], updateRequest);

      //then
      expect(postMock).toHaveBeenCalledWith(getEnvironment().widen.uploadUrl, expect.any(Object), expect.anything());
      expect(result).toStrictEqual(updateResponseMock.data._links.self);
    }, 4000);
  });

  describe('checkTestStatusOfItem', () => {
    it('should correctly identify if test item prefix is present in a productId', () => {
      const firstTestFileName = `${ICALC_DYNAMIC_MAT_NUMBER_PREFIX}MAT017something`;

      expect(testSubject.checkTestStatusOfItem(ICALC_DYNAMIC_MAT_NUMBER_PREFIX, firstTestFileName)).toBe(true);

      const secondTestFileName = `MAT017something`;

      expect(testSubject.checkTestStatusOfItem(ICALC_DYNAMIC_MAT_NUMBER_PREFIX, secondTestFileName)).toBe(false);
    });
  });
});
