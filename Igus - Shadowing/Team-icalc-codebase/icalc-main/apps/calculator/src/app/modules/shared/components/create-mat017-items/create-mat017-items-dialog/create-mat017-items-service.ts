import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable, Subject } from 'rxjs';
import {
  ICALC_MAT017_ITEM_MANUAL_CREATION_HARD_LIMIT,
  formatBusinessUnitExcelFloat,
  Mat017ItemCreationData,
} from '@igus/icalc-domain';

@Injectable({ providedIn: 'root' })
export class CreateMat017ItemsService {
  public toggleColumnKey: keyof Mat017ItemCreationData = 'addToBomOnCreate';
  public purchasePriceColumnKey: keyof Mat017ItemCreationData = 'amount';
  private errorMessageSubject = new Subject<string>();
  private rowsHardLimit: number;

  constructor(private readonly translate: TranslateService) {
    this.rowsHardLimit = ICALC_MAT017_ITEM_MANUAL_CREATION_HARD_LIMIT;
  }

  public parsePastedData(
    tsv: string,
    modelDataKeys: (keyof Mat017ItemCreationData)[]
  ): Mat017ItemCreationData[] | string {
    const rows = this.parseRowsUpToHardLimit(tsv, this.rowsHardLimit);

    const delimitedRows = rows.map((row) => this.parseColumns(row));
    const areAllColumnsPresent = this.validateParsedData(delimitedRows);

    if (!areAllColumnsPresent) {
      this.nextErrorMessage(this.translate.instant('icalc.create_new_mat017_item_dialog.MISSING_FIELD_ON_PASTE_ERROR'));
      return '';
    }
    return delimitedRows.map((row) => this.mapToMat017ItemCreationData(row, modelDataKeys));
  }

  public async pasteFromClipBoard(): Promise<string> {
    if (!navigator?.clipboard) return '';

    return await navigator.clipboard.readText();
  }

  public modelHasNoValues(model: Mat017ItemCreationData): boolean {
    return Object.keys(model).every((key) => {
      const value = model[key as keyof Mat017ItemCreationData];

      if (typeof value === 'string') {
        return !value.trim() || !value.length;
      }
      if (typeof value === 'boolean') {
        return true;
      }
      return value == null;
    });
  }

  public getErrorMessage(): Observable<string> {
    return this.errorMessageSubject.asObservable();
  }

  public nextErrorMessage(message: string): void {
    this.errorMessageSubject.next(message);
  }

  private parseRowsUpToHardLimit(data: string, hardLimit: number): string[] {
    return data
      .split(/\r\n|\n|\r/)
      .slice(0, hardLimit)
      .filter((row) => !!row.trim()?.length);
  }

  private parseColumns(data: string): string[] {
    return data.split(/\t/).slice(0, 7);
  }

  private mapToMat017ItemCreationData(
    tsvRow: string[],
    modelDataKeys: (keyof Mat017ItemCreationData)[]
  ): Mat017ItemCreationData {
    const trimString = (str: unknown): unknown => (typeof str === 'string' ? str.trim() : str);
    const mapped = modelDataKeys.map((key, index) =>
      key === this.toggleColumnKey
        ? [key, false]
        : key === this.purchasePriceColumnKey
          ? [key, this.transformPurchasePriceField(tsvRow?.[index] as string)]
          : [key, trimString(tsvRow?.[index]) || null]
    );

    return Object.fromEntries(mapped);
  }

  private validateParsedData(dataRows: string[][]): boolean {
    return dataRows.every((row) => row.length >= 7 && row.every((column) => !!column === true));
  }

  private transformPurchasePriceField(str: string): number {
    return formatBusinessUnitExcelFloat(str);
  }
}
