import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { HttpService } from '@nestjs/axios';
import { ArrayUtils, WidenData, WidenDataItem, WidenUploadImage } from '@igus/icalc-domain';
import { catchError, firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import 'multer';
import { Mat017InfrastructureModuleLogger } from './logger.service';
import { AxiosResponse } from 'axios';

@Injectable()
export class Mat017ItemWidenService {
  private readonly headers = { authorization: getEnvironment().widen.bearerToken };
  private readonly defaulParams = {
    expand: 'metadata,embeds',
    limit: '100',
    // include_deleted: true, // TODO might be useful to handle deleted images at some point (ICALC-736)
  };

  constructor(
    private readonly httpService: HttpService,
    private logger: Mat017InfrastructureModuleLogger
  ) {}

  public async getImagesFromWiden(matNumbers: string[] | string): Promise<WidenData> {
    const params = {
      ...this.defaulParams,
      query: `productid:(${Array.isArray(matNumbers) ? matNumbers.join(' or ') : matNumbers})`,
    };

    return firstValueFrom(
      this.httpService.get<WidenData>(getEnvironment().widen.searchUrl, {
        params,
        headers: this.headers,
      })
    )
      .then((response) => {
        this.logger.debug(`received images for matNumbers from widen`);
        return response.data;
      })
      .catch((error) => {
        this.logger.error(error);
        throw new InternalServerErrorException(
          'download request to widen resulted in an error, please try again later'
        );
      });
  }

  public async getImageFromWiden(url: string): Promise<WidenDataItem> {
    return firstValueFrom(
      this.httpService
        .get<WidenDataItem>(url, {
          params: { expand: 'embeds,status' },
          headers: this.headers,
        })
        .pipe(
          catchError((error: unknown) => {
            this.logger.error(error as string);
            throw new InternalServerErrorException('cannot get uploaded image from widen, please try again later');
          }),
          map((response) => {
            const result = response.data;

            if (result.status.upload_progress !== 'complete') {
              this.logger.debug('waiting for upload to finish');
              throw new HttpException('processing', HttpStatus.NOT_FOUND);
            }

            return result;
          })
        )
    );
  }

  public async uploadImageToWiden(fileArray: Array<Express.Multer.File>, data: WidenUploadImage): Promise<string> {
    if (!fileArray[0]?.buffer || !data) {
      throw new InternalServerErrorException('missing upload data');
    }

    const imageBlob = new Blob([fileArray[0]?.buffer]);

    const formData = new FormData();

    formData.append('file', imageBlob);
    formData.append('filename', data.filename);
    formData.append('profile', getEnvironment().widen.profile);
    formData.append(
      'metadata',
      `{ fields: { description: ['${data.description}'], productid: [${data.matNumber}], titleTag: [${data.titleTag}] } }`
    );

    return firstValueFrom(
      this.httpService
        .post<{ _links: { self: 'string' } }>(getEnvironment().widen.uploadUrl, formData, {
          headers: this.headers,
        })
        .pipe(
          catchError((error: unknown) => {
            this.logger.error(error as string);
            throw new InternalServerErrorException(
              'upload request to widen resulted in an error, please try again later'
            );
          }),
          map((response) => {
            return response.data._links.self;
          })
        )
    );
  }

  /**
   *
   * @param identifier could be matNumber, partial matNumber, e2e-prefix, etc.
   */
  public async deleteMat017ItemImagesFromWiden(identifier: string): Promise<{ success: boolean }> {
    const ids = await this.getIdsForMat017ItemImagesFromWiden(identifier);

    if (ArrayUtils.isEmpty(ids)) return new Promise((resolve) => resolve({ success: true }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultArray: Observable<AxiosResponse<any, any>>[] = [];

    ids.forEach((id) => {
      const result = this.httpService.delete(getEnvironment().widen.deleteUrl + id, { headers: this.headers });

      resultArray.push(result);
    });

    return new Promise<{ success: boolean }>((resolve) => {
      forkJoin(resultArray).subscribe((joinedApiResults) => {
        const result = { success: true };

        joinedApiResults.forEach((apiResult) => {
          if (apiResult.status !== 204) {
            result.success = false;
          }
        });

        resolve(result);
      });
    });
  }

  public checkTestStatusOfItem(prefix: string, productId: string): boolean {
    return productId.includes(prefix);
  }

  private async getIdsForMat017ItemImagesFromWiden(prefix: string): Promise<string[]> {
    const params = {
      ...this.defaulParams,
      query: `productid:(${prefix}*)`,
    };

    return firstValueFrom(
      this.httpService.get<WidenData>(getEnvironment().widen.searchUrl, {
        params,
        headers: this.headers,
      })
    )
      .then((response) => {
        const ids = [];

        if (response.data?.total_count > 0) {
          response.data?.items.forEach((item) => {
            if (this.checkTestStatusOfItem(prefix, item?.metadata?.fields?.productid[0])) ids.push(item?.id);
          });
        }

        return ids;
      })
      .catch((error) => {
        throw new InternalServerErrorException('request to widen resulted in an error', error);
      });
  }
}
