import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import type { WidenUploadImage } from '@igus/icalc-domain';
import { Mat017ItemWidenService } from '@igus/icalc-configurations-infrastructure';
import { Mat017ItemController } from './mat017-item.controller';
import { Mat017ItemService } from '@igus/icalc-configurations-application';
import { Mat017RequestMappersService } from './mat017-item-request-mapper-service';

describe('Mat017ItemImageController', () => {
  let testSubject: Mat017ItemController;
  let widenService: Mat017ItemWidenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Mat017ItemController,
        {
          provide: Mat017ItemWidenService,
          useValue: {
            getImagesFromWiden: async (_: string[] | string) => undefined,
            uploadImageToWiden: async (_: WidenUploadImage) => undefined,
          },
        },
        {
          provide: Mat017ItemService,
          useValue: {},
        },
        {
          provide: Mat017RequestMappersService,
          useValue: {},
        },
      ],
    }).compile();

    testSubject = module.get<Mat017ItemController>(Mat017ItemController);
    widenService = module.get<Mat017ItemWidenService>(Mat017ItemWidenService);
  });
  describe('getImages', () => {
    let spyOnGetImagesFromWiden: unknown;

    beforeEach(() => {
      spyOnGetImagesFromWiden = jest.spyOn(widenService, 'getImagesFromWiden');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should throw BadRequestException when empty array is passed to getImages', async () => {
      try {
        await testSubject.getImages([]);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(spyOnGetImagesFromWiden).not.toHaveBeenCalled();
      }
    });

    it('should throw BadRequestException when no array is passed to getImages', async () => {
      try {
        await testSubject.getImages(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(spyOnGetImagesFromWiden).not.toHaveBeenCalled();
      }
    });

    it('should call getImagesFromWiden when a string is passed to getImages', async () => {
      const paramValue = 'MAT12345';

      await testSubject.getImages(paramValue);

      expect(spyOnGetImagesFromWiden).toHaveBeenCalledWith(paramValue);
    });

    it('should call getImagesFromWiden when a array of strings is passed to getImages', async () => {
      const paramValue = ['MAT12345', 'MAT22345'];

      await testSubject.getImages(paramValue);

      expect(spyOnGetImagesFromWiden).toHaveBeenCalledWith(paramValue);
    });
  });
});
