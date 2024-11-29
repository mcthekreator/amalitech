import type {
  CreateMat017ItemManuallyResponseDto,
  IcalcListResult,
  Mat017Item,
  Mat017ItemLatestModificationDateResponseDto,
  Mat017ItemSearchResult,
  WidenData,
  WidenDataItem,
  WidenUploadImage,
} from '@igus/icalc-domain';
import { ArrayUtils, Mat017ItemListParameter, normalizeListInformation } from '@igus/icalc-domain';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UnsupportedMediaTypeException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Mat017ItemService } from '@igus/icalc-configurations-application';
import { CreateMat017ItemsManuallyDto, FindMat017ItemByMatNumberDto } from '../dtos';
import { Mat017RequestMappersService } from './mat017-item-request-mapper-service';
import { Mat017ItemWidenService } from '@igus/icalc-configurations-infrastructure';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('mat017-item')
@Controller('mat017-item')
export class Mat017ItemController {
  constructor(
    private readonly mat017ItemService: Mat017ItemService,
    private readonly mat017ItemRequestMapperService: Mat017RequestMappersService,
    private readonly widenService: Mat017ItemWidenService
  ) {}

  @Get('')
  public search(@Query() listInformation: Mat017ItemListParameter): Promise<IcalcListResult<Mat017ItemSearchResult>> {
    return this.mat017ItemService.searchMat017Item(
      normalizeListInformation(listInformation) as Mat017ItemListParameter
    );
  }

  @Get('findByMatNumber')
  public findMat017ItemByNumber(@Query() findMat017ItemDto: FindMat017ItemByMatNumberDto): Promise<Mat017Item> {
    const parsedMatNumber = this.mat017ItemRequestMapperService.getParsedMatNumber(findMat017ItemDto.matNumber);

    return this.mat017ItemService.findOneByMatNumber(parsedMatNumber);
  }

  @Post('')
  public async create(
    @Body() createMat017ItemsManuallyDto: CreateMat017ItemsManuallyDto
  ): Promise<CreateMat017ItemManuallyResponseDto> {
    const mat017Items = createMat017ItemsManuallyDto.mat017Items;
    const mappedMat017Items = this.mat017ItemRequestMapperService.fromCreateMat017ItemRequest(mat017Items);

    return this.mat017ItemService.create(mappedMat017Items);
  }

  @HttpCode(204)
  @Delete(':matNumber')
  public async delete(@Param('matNumber') matNumber: string): Promise<void> {
    await this.mat017ItemService.removeManuallyCreatedMat017Item(matNumber);
  }

  @Get('latestModificationDate')
  public getLatestModificationDate(): Promise<Mat017ItemLatestModificationDateResponseDto> {
    return this.mat017ItemService.getLatestModificationDate();
  }

  @Get('images')
  public async getImages(@Query('matNumbers') matNumbers: string[] | string): Promise<WidenData> {
    if (!matNumbers && ArrayUtils.isEmpty(matNumbers))
      throw new BadRequestException('Query parameter matNumbers is missing');
    return this.widenService.getImagesFromWiden(matNumbers);
  }

  @Get('image')
  public async getImage(@Query('url') url: string): Promise<WidenDataItem> {
    if (!url) throw new BadRequestException('Query parameter url is missing');

    return this.widenService.getImageFromWiden(url);
  }

  @Post('image')
  @UseInterceptors(FilesInterceptor('file', 1))
  public async uploadImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /(gif|jpeg|png|web|webp)$/ }),
        ],
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        exceptionFactory: (error) => {
          console.error(error);
          if (error.includes('gif|jpeg|png|web|webp')) {
            return new UnsupportedMediaTypeException(
              `Validation failed. Allowed file types are .gif, .jpeg, .png, .web or .webp`
            );
          }
        },
      })
    )
    fileArray: Array<Express.Multer.File>,
    @Body() data: WidenUploadImage
  ): Promise<string> {
    return this.widenService.uploadImageToWiden(fileArray, data);
  }
}
