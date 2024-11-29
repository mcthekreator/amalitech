import { Mat017ItemIerpService, Mat017ItemParsingService } from '@igus/icalc-configurations-infrastructure';
import type {
  IerpMat017Item,
  BusinessUnitExcelMat017ItemModel,
  IerpMat017ItemToBusinessUnitExcelComparisonResult,
} from '@igus/icalc-domain';
import { CommandRunner, Option, SubCommand } from 'nest-commander';

interface CompareIerpToBusinessUnitExcelCommandOptions {
  notIncludedInBusinessUnitExcelFile?: boolean;
}

class Mat017ItemInBusinessUnitExcelHandler {
  private readonly diffsBetweenIerpAndBu: string[] = [];

  constructor(private readonly options: CompareIerpToBusinessUnitExcelCommandOptions) {}

  public handle(
    ierpMat017Item: IerpMat017Item,
    businessUnitExcelMat017ItemModel: BusinessUnitExcelMat017ItemModel
  ): void {
    const result = businessUnitExcelMat017ItemModel.compareToIerpMat017Item(ierpMat017Item);

    if (!result.hasChanges || this.options.notIncludedInBusinessUnitExcelFile) {
      return;
    }

    this.logChanges(result, this.options);
    this.diffsBetweenIerpAndBu.push(
      JSON.stringify({
        matNumber: ierpMat017Item.matNumber,
        ...result.diff,
      })
    );
  }

  public getDiffs(): string[] {
    return this.diffsBetweenIerpAndBu;
  }

  private logChanges(
    result: IerpMat017ItemToBusinessUnitExcelComparisonResult,
    options: CompareIerpToBusinessUnitExcelCommandOptions
  ): void {
    if (!options.notIncludedInBusinessUnitExcelFile) {
      console.log('Diff between IERP and BusinessUnitExcelFile', JSON.stringify(result.diff));
      console.log('Item from IERP', result.ierpMat017ItemBaseData);
      console.log('Item from current BusinessUnitExcelFile', result.businessUnitExcelMat017ItemBaseData);
    }
  }
}

class Mat017ItemNotInBusinessUnitExcelHandler {
  private readonly mat017ItemsNotIncludedInBusinessUnitFile: string[] = [];

  constructor(private readonly options: CompareIerpToBusinessUnitExcelCommandOptions) {}

  public handle(
    ierpMat017Item: IerpMat017Item,
    businessUnitExcelMat017ItemModel: BusinessUnitExcelMat017ItemModel
  ): void {
    if (businessUnitExcelMat017ItemModel) {
      return;
    }

    if (!this.options.notIncludedInBusinessUnitExcelFile) {
      console.log(`ITEM ${ierpMat017Item.matNumber} not in BusinessUnitExcelFile`);
    }
    this.mat017ItemsNotIncludedInBusinessUnitFile.push(ierpMat017Item.matNumber);
  }

  public getNotIncludedItems(): string[] {
    return this.mat017ItemsNotIncludedInBusinessUnitFile;
  }
}

class IerpToBusinessUnitExcelComparisonHandler {
  private mat017ItemInBusinessUnitExcelHandler: Mat017ItemInBusinessUnitExcelHandler;
  private mat017ItemNotInBusinessUnitExcelHandler: Mat017ItemNotInBusinessUnitExcelHandler;

  private constructor(
    private readonly mat017ItemsFromIerp: IerpMat017Item[],
    private readonly mat017ItemsFromBusinessUnitExcel: Map<string, BusinessUnitExcelMat017ItemModel>,
    private readonly options: CompareIerpToBusinessUnitExcelCommandOptions
  ) {
    this.compareAllItems();
    this.logSummary();
  }

  public static create(
    mat017ItemsFromIerp: IerpMat017Item[],
    mat017ItemsFromBusinessUnitExcel: Map<string, BusinessUnitExcelMat017ItemModel>,
    options: CompareIerpToBusinessUnitExcelCommandOptions
  ): IerpToBusinessUnitExcelComparisonHandler {
    return new IerpToBusinessUnitExcelComparisonHandler(mat017ItemsFromIerp, mat017ItemsFromBusinessUnitExcel, options);
  }

  private compareAllItems(): void {
    this.mat017ItemInBusinessUnitExcelHandler = new Mat017ItemInBusinessUnitExcelHandler(this.options);
    this.mat017ItemNotInBusinessUnitExcelHandler = new Mat017ItemNotInBusinessUnitExcelHandler(this.options);

    this.mat017ItemsFromIerp.forEach((ierpMat017Item) => {
      const businessUnitExcelMat017ItemModel = this.mat017ItemsFromBusinessUnitExcel.get(ierpMat017Item.matNumber);

      if (businessUnitExcelMat017ItemModel) {
        this.mat017ItemInBusinessUnitExcelHandler.handle(ierpMat017Item, businessUnitExcelMat017ItemModel);
      } else {
        this.mat017ItemNotInBusinessUnitExcelHandler.handle(ierpMat017Item, businessUnitExcelMat017ItemModel);
      }
    });
  }

  private logSummary(): void {
    const mat017ItemsNotIncludedInBusinessUnitFile = this.mat017ItemNotInBusinessUnitExcelHandler.getNotIncludedItems();

    if (!this.options.notIncludedInBusinessUnitExcelFile) {
      const diffsBetweenIerpAndBuLength = this.mat017ItemInBusinessUnitExcelHandler.getDiffs().length;

      console.log(
        'Number of Mat017Items with differences between IERP and BusinessUnitExcelFile:',
        diffsBetweenIerpAndBuLength
      );

      console.log(
        'Number of Mat017Items not included in BusinessUnitExcelFile:',
        mat017ItemsNotIncludedInBusinessUnitFile.length
      );
    } else {
      console.log(mat017ItemsNotIncludedInBusinessUnitFile);
    }
  }
}

@SubCommand({
  name: 'compare-ierp-to-business-unit-excel',
  description:
    'A cli command to fetch mat017Items and prices from IERP service and compare them with a local copy of a BusinessUnitExcel file for test purposes.',
})
export class CompareIerpToBusinessUnitExcelCommand extends CommandRunner {
  constructor(
    private readonly mat017ItemIerpService: Mat017ItemIerpService,
    private readonly mat017ItemParsingService: Mat017ItemParsingService
  ) {
    super();
  }

  @Option({
    flags: '-ni, --notIncludedInBusinessUnitExcelFile',
    description: 'Return list of Mat017Items from IERP which are not included in the provided BusinessUnitExcelFile',
    required: false,
    defaultValue: false,
  })
  public getMat017ItemsNotIncludedInBusinessUnitExcelFile(_param: string): boolean | string {
    return true;
  }

  public async run(passedParam: string[], options?: CompareIerpToBusinessUnitExcelCommandOptions): Promise<void> {
    const additionalParameter = passedParam[0];

    if (additionalParameter) {
      console.log(
        JSON.stringify(
          {
            status: 'error',
            message: 'unknown parameter given',
          },
          null,
          2
        )
      );
      return;
    }

    console.log('icalc-cli - test-ierp');

    const mat017ItemsFromIerp = await this.mat017ItemIerpService.getAllMat017Items();
    const mat017ItemsFromBusinessUnitExcel =
      await this.mat017ItemParsingService.parseAndPrepareBusinessUnitExcelMat017Items();

    IerpToBusinessUnitExcelComparisonHandler.create(mat017ItemsFromIerp, mat017ItemsFromBusinessUnitExcel, options);
  }
}
