import { Mat017ItemWidenService } from '@igus/icalc-configurations-infrastructure';
import { ICALC_DYNAMIC_MAT_NUMBER_PREFIX } from '@igus/icalc-domain';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'delete-mat017-test-item-widen-images',
  description: 'a cli command to delete all mat017 item test object widen images',
})
export class DeleteMat017TestItemWidenImagesCommand extends CommandRunner {
  constructor(private readonly widenService: Mat017ItemWidenService) {
    super();
  }

  public async run(passedParam: string[]): Promise<void> {
    const additionalParameter = passedParam[0];

    if (additionalParameter) {
      console.log(
        JSON.stringify(
          {
            status: 'error',
            message: `an additional parameter was passed: ${additionalParameter}`,
          },
          null,
          2
        )
      );
      return;
    }

    try {
      const deleteResult = await this.widenService.deleteMat017ItemImagesFromWiden(ICALC_DYNAMIC_MAT_NUMBER_PREFIX);

      if (deleteResult.success) {
        console.log(JSON.stringify({ status: 'ok', message: `widen images for test objects deleted` }, null, 2));
      }
    } catch (error) {
      console.log(
        JSON.stringify({ status: 'error', message: `could not delete widen images for test objects`, error }, null, 2)
      );
    }
  }
}
