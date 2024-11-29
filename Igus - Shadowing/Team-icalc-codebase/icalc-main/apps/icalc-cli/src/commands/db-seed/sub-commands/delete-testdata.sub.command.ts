import { DbSeedService } from '@igus/icalc-calculations-infrastructure';
import { CommandRunner, SubCommand } from 'nest-commander';
import { formatDbSeedResponse } from '../db-seed.helpers';

@SubCommand({
  name: 'delete-testdata',
  description: 'deletes test data',
})
export class DeleteTestdataCommand extends CommandRunner {
  constructor(private readonly dbSeedService: DbSeedService) {
    super();
  }

  public async run(passedParam: string[]): Promise<void> {
    const additionalParameter = passedParam[0];
    let errorOccured = false;

    if (additionalParameter) {
      console.log(formatDbSeedResponse('error', `unknown sub-command: ${additionalParameter}`));
      return;
    }

    try {
      await this.dbSeedService.deleteAllDynamicallyCreatedCalculationsAndConfigurations();
    } catch (error) {
      errorOccured = true;
      this.logDeleteError(error);
    }

    if (!errorOccured) {
      console.log(formatDbSeedResponse('ok', 'test data deleted'));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logDeleteError(error: any): void {
    console.log(formatDbSeedResponse('error', 'could not delete existing test data', error));
  }
}
