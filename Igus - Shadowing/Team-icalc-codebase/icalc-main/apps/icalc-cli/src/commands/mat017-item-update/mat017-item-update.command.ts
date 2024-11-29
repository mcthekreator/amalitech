import { Mat017ItemParsingService, Mat017ItemUpdateService } from '@igus/icalc-configurations-infrastructure';
import { Command, CommandRunner } from 'nest-commander';
import { FetchFromIerpCommand } from './sub-commands/fetch-from-ierp.sub.command';
import { CompareIerpToBusinessUnitExcelCommand } from './sub-commands/compare-ierp-to-business-unit-excel.sub.command';

@Command({
  name: 'mat017-item-update',
  description: 'a cli command to update mat017 items & usages',
  subCommands: [FetchFromIerpCommand, CompareIerpToBusinessUnitExcelCommand],
})
export class Mat017ItemUpdateCommand extends CommandRunner {
  constructor(
    private readonly mat017ItemParsingService: Mat017ItemParsingService,
    private readonly mat017ItemUpdateService: Mat017ItemUpdateService
  ) {
    super();
  }

  public async run(passedParam: string[]): Promise<void> {
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

    console.log('icalc-cli - start import process for MAT017 items & usages');

    try {
      const uniqueBaseData = await this.mat017ItemParsingService.parseAndPrepareBaseData();
      const correspondingPrices = await this.mat017ItemParsingService.parseAndPreparePrices();

      await this.mat017ItemUpdateService.updateItemsFromCsv(uniqueBaseData, correspondingPrices);

      const parsedUsages = await this.mat017ItemParsingService.parseUsages();

      await this.mat017ItemUpdateService.updateUsages(parsedUsages);

      console.log('icalc-cli - finished import process for MAT017 items & usages');
    } catch (error) {
      console.log('icalc-cli - could not update mat017 items: ', error);
    }
  }
}
