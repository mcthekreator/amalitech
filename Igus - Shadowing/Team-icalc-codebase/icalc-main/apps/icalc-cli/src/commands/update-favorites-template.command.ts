import { FavoriteFileParsingService } from '@igus/icalc-configurations-infrastructure';
import { Command, CommandRunner, Option } from 'nest-commander';

interface FavoriteTemplateUpdateCommandOptions {
  source: string;
  destination: string;
}

@Command({
  name: 'gen-favorite-update-migration',
  description: 'a cli command to update favorites by generating migration script from the excel document.',
})
export class UpdateFavoritesTemplateCommand extends CommandRunner {
  constructor(private readonly favoriteFileParsingService: FavoriteFileParsingService) {
    super();
  }

  @Option({
    flags: '-s, --source [string]',
    description: 'name of source file in xlsx format',
  })
  public parseSourceFileName(name: string): string {
    return name;
  }

  @Option({
    flags: '-d, --destination [string]',
    description: 'name of file to be created at destination, should follow the migration-script naming convention',
  })
  public parseDestinationFileName(name: string): string {
    return name;
  }

  public async run(passedParam: string[], options: FavoriteTemplateUpdateCommandOptions): Promise<void> {
    const additionalParameter = passedParam[0];
    const { source, destination } = options;

    if (additionalParameter) {
      console.log(this.formatError('unknown parameter given'));
      return;
    }
    if (!source || !destination) {
      console.error(this.formatError('Source and Migration-script file names are required'));
      return;
    }
    const [error, message] = this.validateParams(options);

    if (error) {
      console.error(this.formatError(message));
      return;
    }
    this.favoriteFileParsingService.parseExcelDocument(source);
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

  private validateParams({ source, destination }: { source: string; destination: string }): [boolean, string] {
    const destFileNameRegex = /^V\d+__[a-zA-Z0-9-_]+\.sql$/;

    if (!source.endsWith('.xlsx')) return [true, 'Source file must have extension .xlsx'];

    if (source.includes('/') || source.includes(`\\`)) {
      return [
        true,
        'Do not provide the full path for the source file. Only ensure it is located in apps/data-import/csv-files.',
      ];
    }

    if (destination.includes('/') || destination.includes(`\\`)) {
      return [
        true,
        'Do not provide the full path for the destination file. It will be saved in apps/data-import/csv-files by default.',
      ];
    }

    if (!destFileNameRegex.test(destination)) {
      return [true, 'Destination file name must follow the migration script naming convention'];
    }
    return [false, ''];
  }
}
