import { Mat017ItemIerpService, Mat017ItemUpdateService } from '@igus/icalc-configurations-infrastructure';
import { Mat017ItemMappers } from '@igus/icalc-domain';
import { CommandRunner, Option, SubCommand } from 'nest-commander';

interface FetchFromIerpCommandOptions {
  usages?: boolean;
  mat017Items?: boolean;
  mat017Item?: string;
  update?: boolean;
  dryRun?: boolean;
}

@SubCommand({
  name: 'fetch-from-ierp',
  description: 'a cli command to update mat017Items & usages',
})
export class FetchFromIerpCommand extends CommandRunner {
  constructor(
    private readonly mat017ItemIerpService: Mat017ItemIerpService,
    private readonly mat017ItemUpdateService: Mat017ItemUpdateService
  ) {
    super();
  }

  @Option({
    flags: '-i, --mat017Items',
    description: 'Fetching all mat017Items',
    required: false,
    defaultValue: false,
  })
  public fetchMat017Items(_param: string): boolean | string {
    return true;
  }

  @Option({
    flags: '-i, --mat017Item <matNumber>',
    description: 'Fetching single mat017Item',
    required: false,
    defaultValue: false,
  })
  public fetchMat017Item(param: string): string {
    return param;
  }

  @Option({
    flags: '-us, --usages',
    description: 'Fetching usages of Mat017Items',
    required: false,
    defaultValue: false,
  })
  public fetchMat017ItemsUsages(): boolean {
    return true;
  }

  @Option({
    flags: '-up, --update',
    description: 'Defines whether the items should be updated in icalc.',
    required: false,
    defaultValue: false,
  })
  public update(): boolean {
    return true;
  }

  @Option({
    flags: '-dr, --dryRun',
    description: 'Shows what would be updated without executing the update.',
    required: false,
    defaultValue: false,
  })
  public dryRun(): boolean {
    return true;
  }

  public async run(passedParam: string[], options?: FetchFromIerpCommandOptions): Promise<void> {
    const additionalParameter = passedParam[0];

    if (additionalParameter) {
      console.log(this.formatError('unknown parameter given'));
      return;
    }

    console.log('icalc-cli - fetch from ierp');

    if (!options.mat017Item && !options.mat017Items && !options.usages) {
      console.log(this.formatError('You need to provide one of these flags: --mat017Item, --mat017Items, --usages'));
      return;
    }

    await this.handleUsages(options);
    await this.handleMat017Items(options);
    await this.handleSingleMat017Item(options);
  }

  private async handleUsages(options: FetchFromIerpCommandOptions): Promise<void> {
    if (options.usages) {
      const mat017ItemsUsages = await this.mat017ItemIerpService.getAllMat017ItemsUsages();

      if (options.update) {
        const importMat017ItemsUsages = mat017ItemsUsages.map((usage) =>
          Mat017ItemMappers.fromIerpMat017ItemUsageToMat017ImportUsage(usage)
        );

        await this.mat017ItemUpdateService.updateUsages(importMat017ItemsUsages);
      } else {
        console.log('Result \n', mat017ItemsUsages);
      }
    }
  }

  private async handleMat017Items(options: FetchFromIerpCommandOptions): Promise<void> {
    if (options.mat017Items) {
      const result = await this.mat017ItemIerpService.getAllMat017Items();

      if (options.update) {
        await this.mat017ItemUpdateService.updateItemsFromIerp(result, options.dryRun);
      } else {
        console.log('Result \n', result);
      }
    }
  }

  private async handleSingleMat017Item(options: FetchFromIerpCommandOptions): Promise<void> {
    if (options.mat017Item) {
      const result = await this.mat017ItemIerpService.getMat017Item(options.mat017Item);

      if (options.update) {
        console.log('Updating single Mat017Item is not supported.');
      }
      console.log('Result \n', result);
    }
  }

  private formatError(message: string): string {
    return JSON.stringify(
      {
        status: 'error',
        message,
      },
      null,
      2
    );
  }
}
