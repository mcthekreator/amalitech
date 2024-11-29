import { AuthService } from '@igus/icalc-auth';
import { icalcTestUser } from '@igus/icalc-domain';
import { CommandRunner, SubCommand } from 'nest-commander';
import { formatDbSeedResponse } from '../db-seed.helpers';

@SubCommand({
  name: 'user',
  description: 'generates icalc test user',
})
export class UserCommand extends CommandRunner {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async run(passedParam: string[]): Promise<void> {
    const additionalParameter = passedParam[0];

    if (additionalParameter) {
      console.log(formatDbSeedResponse('error', `unknown sub-command: ${additionalParameter}`));
      return;
    }
    const currentTestUser = await this.authService.findUserByEmail(icalcTestUser.email);

    if (currentTestUser) {
      console.log(formatDbSeedResponse('ok', 'icalc test user already exists'));
      return;
    }

    try {
      await this.authService.signUp(icalcTestUser);
      console.log(formatDbSeedResponse('ok', 'generated icalc test user'));
    } catch (error) {
      console.log(formatDbSeedResponse('error', 'could not generate icalc test user', error));
    }
  }
}
