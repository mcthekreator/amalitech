import { AuthService } from '@igus/icalc-auth';
import { Command, CommandRunner, Option } from 'nest-commander';

interface DbLocalUserOptions {
  firstName?: string;
  lastName?: string;
  role?: string;
}

@Command({
  name: 'db-local-user',
  description: 'a cli command to generate a local icalc user for development',
  arguments: '<email> <password>',
})
export class DbLocalUserCommand extends CommandRunner {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Option({
    flags: '-f, --firstName [string]',
    description: 'first name',
    required: false,
    defaultValue: 'firstName',
  })
  public parseFirstName(firstName: string): string {
    return firstName;
  }

  @Option({
    flags: '-l, --lastName [string]',
    description: 'last name',
    required: false,
    defaultValue: 'lastName',
  })
  public parseLastName(lastName: string): string {
    return lastName;
  }

  @Option({
    flags: '-r, --role [string]',
    description: 'role',
    required: false,
    defaultValue: 'iCalc Developer',
  })
  public parseRole(role: string): string {
    return role;
  }

  public async run(passedParam: string[], options: DbLocalUserOptions): Promise<void> {
    const [email, password] = passedParam;

    if (email && password) {
      const newUserDto = {
        email,
        password,
        firstName: options.firstName,
        lastName: options.lastName,
        role: options.role,
      };

      try {
        await this.authService.signUp(newUserDto);
        console.log('generated local icalc user:', newUserDto.email);
      } catch (error) {
        console.log('could not generate local icalc user:', error?.response?.message);
      }
    }
  }
}
