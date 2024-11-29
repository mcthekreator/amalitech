import { Command, CommandRunner } from 'nest-commander';
import { UserCommand } from './sub-commands/user.sub.command';
import { CalculationAndConfigurationCommand } from './sub-commands/calculation-and-configuration.sub.command';
import { DeleteTestdataCommand } from './sub-commands/delete-testdata.sub.command';
import { formatDbSeedResponse } from './db-seed.helpers';

@Command({
  name: 'db-seed',
  description: 'a cli command to generate test data',
  subCommands: [UserCommand, CalculationAndConfigurationCommand, DeleteTestdataCommand],
})
export class DbSeedCommand extends CommandRunner {
  public async run(passedParam: string[]): Promise<void> {
    const additionalParameter = passedParam[0];

    if (additionalParameter) {
      console.log(formatDbSeedResponse('error', `unknown sub-command: ${additionalParameter}`));
      return;
    }
  }
}
