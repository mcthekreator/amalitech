import { ObjectUtils, defaultConfigurationState } from '@igus/icalc-domain';
import type { Configuration, ConfigurationState } from '@igus/icalc-domain';
import { ConfigurationEntity } from '@igus/icalc-entities';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION, buildNestedSetStateExpression } from '@igus/icalc-common';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class ConfigurationDataAccessService {
  constructor(
    @InjectRepository(ConfigurationEntity, ICALC_CONNECTION)
    private readonly configurationRepository: Repository<Configuration>,
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource
  ) {}

  public createFromRepo(configuration: Partial<Configuration>): Configuration {
    return this.configurationRepository.create({
      ...configuration,
      state: {
        ...defaultConfigurationState,
        ...(configuration.state ?? {}),
      },
      creationDate: new Date(),
      modificationDate: new Date(),
    });
  }

  public async findOneByMatNumber(matNumber: string): Promise<Configuration> {
    return this.configurationRepository.findOne({
      where: {
        matNumber,
      },
    });
  }

  public async findOneById(id: string): Promise<Configuration> {
    return this.configurationRepository.findOneBy({
      id,
    });
  }

  public async findManyByIds(ids: string[]): Promise<Configuration[]> {
    return this.configurationRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  public async save(configuration: Partial<Configuration>): Promise<Configuration> {
    return this.configurationRepository.save(configuration);
  }

  public async queryConfigurationById(configurationId: string): Promise<Configuration> {
    return this.configurationRepository
      .createQueryBuilder('configuration')
      .leftJoinAndSelect('configuration.singleCableCalculations', 'scc')
      .leftJoinAndSelect('scc.calculation', 'calculation')
      .where({ id: configurationId })
      .getOne();
  }

  public async saveStateInManyConfigurationsTransactional(
    configurations: Configuration[],
    configurationStateKeysToSave: (keyof ConfigurationState)[]
  ): Promise<Configuration[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      await Promise.all(
        configurations.map(({ id, state }) => {
          const stateToSave = ObjectUtils.pickKeys(state, configurationStateKeysToSave);

          return queryRunner.manager
            .createQueryBuilder(ConfigurationEntity, 'configuration')
            .update(ConfigurationEntity)
            .set({
              state: () => buildNestedSetStateExpression(stateToSave),
            })
            .where('id = :id', { id })
            .execute();
        })
      );

      await queryRunner.commitTransaction();

      return configurations;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Could not update Configurations: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
