import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promisify } from 'util';
import libre from 'libreoffice-convert';
@Injectable()
export class ConvertToXlsService {
  private convertAsync;
  constructor() {
    this.convertAsync = promisify(libre.convert);
  }

  public async convertXlsxToXls(inputBuffer: Buffer): Promise<Buffer> {
    try {
      return await this.convertAsync(inputBuffer, '.xls', undefined);
    } catch (error) {
      console.error(`Error during conversion: ${error.message}`);
      throw new InternalServerErrorException('Conversion from xlsx to xls failed');
    }
  }
}
