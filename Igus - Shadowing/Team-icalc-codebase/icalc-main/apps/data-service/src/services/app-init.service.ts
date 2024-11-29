/* eslint-disable no-await-in-loop */
import { ArrayUtils } from '@igus/icalc-utils';
import type { OnApplicationBootstrap } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import * as crypto from 'crypto';

import { AuthDataAccessService, getEnvironment } from '@igus/icalc-auth-infrastructure';
import { Logger } from '../logger';
import { AkeneoService } from '../modules/akeneo/services/akeneo.service';
import { AuthService } from '../modules/auth';
import { ChainflexService } from '../modules/chainflex/application';
import { MailService } from '../modules/mail/services/mail.service';
import { Mat017ItemIerpService, Mat017ItemUpdateService } from '@igus/icalc-configurations-infrastructure';
import type { Mat017ImportUsage } from '@igus/icalc-domain';
import { Mat017ItemMappers } from '@igus/icalc-domain';

@Injectable()
export class AppInitService implements OnApplicationBootstrap {
  constructor(
    private readonly chainflexService: ChainflexService,
    private readonly logger: Logger,
    private readonly akeneoService: AkeneoService,
    private readonly mailService: MailService,
    private readonly authDataAccessService: AuthDataAccessService,
    private readonly authService: AuthService,
    private readonly mat017ItemIerpService: Mat017ItemIerpService,
    private readonly mat017ItemUpdateService: Mat017ItemUpdateService
  ) {}

  public async onApplicationBootstrap(): Promise<{
    success: boolean;
  }> {
    if (getEnvironment().env === 'development') {
      return;
    }

    const contexts = this.createContextStrings();

    await this.initUsers();
    this.createAndRunAkeneoCronJob(contexts.akeneoCronJobContext);
    this.createAndRunMat017ItemUsagesCronJob(contexts.mat017ItemUsagesCronJobContext);
    this.createAndRunMat017ItemsCronJob(contexts.mat017ItemsCronJobContext);

    return this.authenticateAndGetAkeneoData();
  }

  private async initUsers(): Promise<void> {
    const initialUsers = getEnvironment().initialUser;

    if (
      (getEnvironment().env === 'production' ||
        getEnvironment().env === 'staging' ||
        getEnvironment().env === 'integration') &&
      ArrayUtils.isNotEmpty(initialUsers)
    ) {
      this.logger.log(`found ${initialUsers?.length} intended user(s) for this environment`);
      await this.setupIcalcUser();
    }
  }

  private async authenticateAndGetAkeneoData(): Promise<{ success: boolean }> {
    const authentication = await this.akeneoService.authenticate();

    if (!authentication) {
      this.logger.log('Akeneo authentication failed.', 'DataService - Akeneo Import');
      return null;
    }
    this.logger.log('Akeneo authentication successful.', 'DataService - Akeneo Import');
    try {
      const chainflexItems = await this.akeneoService.fetchAllChainflexCables(authentication);
      const filteredItems = this.akeneoService.processResults(chainflexItems);

      this.logger.log('Akeneo items are fetched', 'DataService - Akeneo Items info: ' + filteredItems?.length);

      if (filteredItems.length === 0) {
        this.logger.log('Chainflex data in the data base will not change.', 'DataService - Akeneo Import');
      }
      if (ArrayUtils.isNotEmpty(filteredItems)) {
        this.logger.log(
          'Akeneo items are going to be imported',
          'DataService - Akeneo Items to be imported akeneo item amount: ' + chainflexItems?.length
        );
        return this.chainflexService.importChainflexItems(filteredItems);
      }
    } catch (error) {
      this.logger.error('Could not fetch Akeneo items.', 'DataService - Akeneo Import');
    }

    return null;
  }

  private async setupIcalcUser(): Promise<void> {
    for (const userToBeSignedUp of getEnvironment().initialUser) {
      const user = await this.authDataAccessService.findUserByEmail(userToBeSignedUp.email);

      if (!user) {
        const password = crypto.randomBytes(20).toString('hex');
        const singUpResult = await this.authService.signUp({
          ...userToBeSignedUp,
          password,
        });

        if (singUpResult === 'signed-up') {
          this.logger.log(`new user signed up: ${userToBeSignedUp.email}`);

          try {
            await this.mailService.sendOneTimeToken(userToBeSignedUp.email, password);
          } catch (error) {
            this.handleSendMailError(userToBeSignedUp.email, error);
          }
        }
      }
    }
  }

  private async fetchAndMapMat017ItemUsages(): Promise<Mat017ImportUsage[]> {
    const fetchedIerpUsages = await this.mat017ItemIerpService.getAllMat017ItemsUsages(10000);

    return fetchedIerpUsages.map((ierpUsage) =>
      Mat017ItemMappers.fromIerpMat017ItemUsageToMat017ImportUsage(ierpUsage)
    );
  }

  private createContextStrings(): {
    akeneoCronJobContext: string;
    mat017ItemUsagesCronJobContext: string;
    mat017ItemsCronJobContext: string;
  } {
    const contextPrefix = 'DataService - ';

    return {
      akeneoCronJobContext: contextPrefix + 'Akeneo cron job',
      mat017ItemUsagesCronJobContext: contextPrefix + 'MAT017 item usages update cron job',
      mat017ItemsCronJobContext: contextPrefix + 'MAT017 items update cron job',
    };
  }

  private createAndRunAkeneoCronJob(context: string): void {
    const akeneoCronJob = new CronJob('0 0 4 * * *', () => {
      try {
        this.logger.log('Starting Akeneo Import...', context);
        this.authenticateAndGetAkeneoData();
      } catch (e) {
        this.logger.error('Akeneo cron job failed to start.', null, context);
      }
    });

    this.runCronJob(akeneoCronJob);
  }

  private createAndRunMat017ItemUsagesCronJob(context: string): void {
    const mat017ItemUsagesCronJob = new CronJob('0 10 4 * * *', async () => {
      try {
        this.logger.log('Starting MAT017 item usages import...', context);
        const fetchedUsages = await this.fetchAndMapMat017ItemUsages();

        this.mat017ItemUpdateService.updateUsages(fetchedUsages);
      } catch (e) {
        this.logger.error('MAT017 item usages cron job failed to start.', null, context);
      }
    });

    this.runCronJob(mat017ItemUsagesCronJob);
  }

  private createAndRunMat017ItemsCronJob(context: string): void {
    const mat017ItemsCronJob = new CronJob('0 20 * * * *', async () => {
      try {
        this.logger.log('Starting MAT017 items import...', context);
        const fetchedIerpItems = await this.mat017ItemIerpService.getAllMat017Items(10000);

        this.mat017ItemUpdateService.updateItemsFromIerp(fetchedIerpItems);
      } catch (e) {
        this.logger.error('MAT017 items cron job failed to start.', null, context);
      }
    });

    this.runCronJob(mat017ItemsCronJob);
  }

  private runCronJob(cronJob: CronJob): void {
    if (!cronJob.running) {
      cronJob.start();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async handleSendMailError(userMail: string, error: any): Promise<void> {
    this.logger.error(`error while sending invitation mail for user ${userMail}`, error);

    // if the mail has not been sent out, for now we want the user to be deleted right after (after fixing the underlying issues [see ICALC-666], we could rerun the pipeline to trigger the usual user setup process again)
    const deleteResult = await this.authDataAccessService.removeUserByEmail(userMail);

    if (deleteResult?.affected >= 1) {
      this.logger.log(`deleted user: ${userMail}`);
    } else {
      this.logger.log(`deletion for user ${userMail} unsuccessful`);
    }
  }
}
