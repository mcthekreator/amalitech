/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import path from 'path';
import { FavoritesInfrastructureModuleLogger } from './logger.service';
import { LogLevel } from '@igus/kopla-data';

export interface RedactedFavoriteItem {
  matNumber: string;
  amount: number;
  isOptional: boolean;
}

export interface FavoriteTemplate {
  name: string;
  favorites: RedactedFavoriteItem[];
  description: FavoriteTemplateDescription;
}

export interface FavoriteTemplateDescription {
  de_DE: string;
  en_US: string;
}
export interface FavoriteCategory {
  name: string;
  templates: FavoriteTemplate[];
}

@Injectable()
export class FavoriteFileParsingService {
  private readonly favoriteTemplatesFileBasePath = '../../../apps/data-import/csv-files';
  private readonly excelMatNumberColumn = 1;
  private readonly excelQuantityColumn = 7;
  private readonly excelOptionalItemStateColumn = 8;
  constructor(private logger: FavoritesInfrastructureModuleLogger) {}

  public async parseExcelDocument(source: string): Promise<FavoriteCategory[]> {
    const filePath = path.join(__dirname, this.favoriteTemplatesFileBasePath + '/' + source);
    const workBook = new ExcelJS.Workbook();
    const logDetails: string[] = [];

    try {
      await workBook.xlsx.readFile(filePath);
      const categories: FavoriteCategory[] = [];

      workBook.worksheets.forEach((sheet: ExcelJS.Worksheet) => {
        const result = this.processCategory(sheet);

        logDetails.push(`${result.name} - ${result.templates.length} templates, `);
        categories.push(result);
      });
      this.logParseExcelResult(categories.length, logDetails);
      return categories;
    } catch (error) {
      this.logResult('Could not process favorites File', LogLevel.error);
    }
  }

  private processCategory(categorySheet: ExcelJS.Worksheet): FavoriteCategory {
    const categoryName = categorySheet.name;
    const favoriteTemplates: FavoriteTemplate[] = [];
    const favorites: RedactedFavoriteItem[] = [];
    let favoritesTemplateName: string;

    categorySheet.eachRow({ includeEmpty: true }, (row: ExcelJS.Row) => {
      const [isHeaderRow, value] = this.processDataRow(row);

      if (isHeaderRow) {
        if (favorites.length) {
          favoriteTemplates.push(this.buildFavoriteTemplateObject(favoritesTemplateName, favorites));
          favorites.length = 0;
        }
        return (favoritesTemplateName = value as string);
      }

      favorites.push(value as RedactedFavoriteItem);
    });

    if (favorites.length) {
      favoriteTemplates.push(this.buildFavoriteTemplateObject(favoritesTemplateName, favorites));
    }
    return this.buildCategoryObject(categoryName, favoriteTemplates);
  }

  private processDataRow(row: ExcelJS.Row): [boolean, RedactedFavoriteItem | string] {
    const rowData = (Array.isArray(row.values) && row.values.slice(1)) || [];
    const isHeaderRow = !!(rowData.length === 1 && typeof (rowData[0] === 'string'));

    if (isHeaderRow) {
      const header = rowData[0];

      return [isHeaderRow, header as string];
    }
    const favoriteItem = {
      matNumber: row.getCell(this.excelMatNumberColumn).value,
      amount: row.getCell(this.excelQuantityColumn).value,
      isOptional: row.getCell(this.excelOptionalItemStateColumn).value,
    };

    return [isHeaderRow, favoriteItem as RedactedFavoriteItem];
  }

  private buildFavoriteTemplateObject(name: string, favorites: RedactedFavoriteItem[]): FavoriteTemplate {
    return {
      name,
      favorites,
      description: {
        de_DE: name,
        en_US: '',
      },
    };
  }

  private buildCategoryObject(name: string, templates: FavoriteTemplate[]): FavoriteCategory {
    return {
      name,
      templates,
    };
  }

  private logParseExcelResult(length: number, details: string[]): void {
    this.logResult(`Total Categories Processed: ${length}, ${details.join('')}`);
  }

  private logResult(message: string, status?: string): void {
    if (status === LogLevel.error) {
      this.logger.error('UPDATE-FAVORITE-TEMPLATES', `${message}`);
      return;
    }
    this.logger.log('UPDATE-FAVORITE-TEMPLATES', `${message}`);
  }
}
