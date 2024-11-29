import { ConfigurationStateMapper, mat017ItemFieldsToOmit } from '@igus/icalc-domain';
import type {
  ConfigurationStatePresentation,
  Calculation,
  Configuration,
  SingleCableCalculation,
  IcalcLibrary,
  ConfigurationSnapshot,
  PublicIcalcUser,
  ChainflexPrice,
  CommercialWorkStepOverrides,
  ConfigurationConnectorStatePresentation,
} from '@igus/icalc-domain';
import { ConfigurationSnapshotEntity, ConfigurationEntity, SingleCableCalculationEntity } from '@igus/icalc-entities';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import type { SelectQueryBuilder } from 'typeorm';
import { ICALC_CONNECTION, buildNestedSetStateExpression, removeChainflexRelatedOverrides } from '@igus/icalc-common';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class SingleCableCalculationDataAccessService {
  constructor(
    @InjectRepository(SingleCableCalculationEntity, ICALC_CONNECTION)
    private readonly singleCableCalculationRepository: Repository<SingleCableCalculation>,
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource
  ) {}

  public save(singleCableCalculation: SingleCableCalculation): Promise<SingleCableCalculation> {
    return this.singleCableCalculationRepository.save(singleCableCalculation);
  }

  public async saveWithConfigurationTransactional(
    singleCableCalculation: SingleCableCalculation,
    configuration: Configuration
  ): Promise<SingleCableCalculation> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    let resultConfiguration: Configuration;
    let resultSingleCableCalculation: SingleCableCalculation;

    const { id } = configuration;
    const state = ConfigurationStateMapper.removeMat017ItemBaseDataFromConnectorState(
      configuration.state as ConfigurationStatePresentation,
      mat017ItemFieldsToOmit
    );

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(ConfigurationEntity)
        .set({
          state: () => buildNestedSetStateExpression(state),
          labelingLeft: configuration.labelingLeft,
          labelingRight: configuration.labelingRight,
          description: configuration.description,
          partNumber: configuration.partNumber,
          modificationDate: configuration.modificationDate,
          modifiedBy: configuration.modifiedBy,
        })
        .where('id = :id', { id })
        .updateEntity(true)
        .execute();

      resultConfiguration = await queryRunner.manager.findOneBy<Configuration>(ConfigurationEntity, {
        id,
      });
      resultSingleCableCalculation = await queryRunner.manager.save(
        SingleCableCalculationEntity,
        singleCableCalculation
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Could not save SingleCableCalculation');
    } finally {
      await queryRunner.release();
    }

    return { ...resultSingleCableCalculation, ...{ configuration: { ...resultConfiguration, state } } };
  }

  public async saveWithSnapshotTransactional(
    user: PublicIcalcUser,
    singleCableCalculation: SingleCableCalculation,
    libraryState: IcalcLibrary,
    connectorState: ConfigurationConnectorStatePresentation
  ): Promise<SingleCableCalculation> {
    const id = singleCableCalculation.snapshotId;
    let updatedSnapshot: ConfigurationSnapshot;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const pathToLibraryState = '{"state", "libraryState"}';
      const libraryStateAsJsonString = JSON.stringify(libraryState);

      const pathToConnectorState = '{"state", "connectorState"}';
      const connectorStateAsJsonString = JSON.stringify(connectorState);

      await queryRunner.manager
        .createQueryBuilder()
        .update(ConfigurationSnapshotEntity)
        .set({
          configurationData: () =>
            `jsonb_set(
              jsonb_set(
                configuration_data,
                '${pathToLibraryState}'::text[],
                '${libraryStateAsJsonString}'::jsonb
              ), 
              '${pathToConnectorState}'::text[],
              '${connectorStateAsJsonString}'::jsonb
            )`,
        })
        .where('id = :id', { id })
        .returning('*')
        .updateEntity(true)
        .execute();

      updatedSnapshot = await queryRunner.manager.findOneBy<ConfigurationSnapshot>(ConfigurationSnapshotEntity, { id });

      updatedSnapshot.modificationDate = new Date();
      updatedSnapshot.modifiedBy = user;

      await queryRunner.manager.save(ConfigurationSnapshotEntity, updatedSnapshot);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Could not save Snapshot with id ${id}`);
    } finally {
      await queryRunner.release();
    }

    return { ...singleCableCalculation, ...{ snapshot: updatedSnapshot } } as SingleCableCalculation;
  }

  public async updateChainflexPriceTransactional(
    singleCableCalculation: SingleCableCalculation,
    newPrice: ChainflexPrice,
    modifiedBy: string
  ): Promise<SingleCableCalculation> {
    const id = singleCableCalculation.configurationId;
    let updatedConfiguration: Configuration;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const pathToChainlexPrice = '{"chainFlexState", "chainflexCable", "price"}';
      const chainflexPriceAsJsonString = JSON.stringify(newPrice);

      await queryRunner.manager
        .createQueryBuilder()
        .update(ConfigurationEntity)
        .set({
          state: () =>
            "jsonb_set(state,'" + pathToChainlexPrice + "'::text[],'" + chainflexPriceAsJsonString + "'::jsonb, true)",
        })
        .where('id = :id', { id })
        .returning('*')
        .updateEntity(true)
        .execute();

      updatedConfiguration = await queryRunner.manager.findOneBy<Configuration>(ConfigurationEntity, { id });

      updatedConfiguration.modifiedBy = modifiedBy;
      updatedConfiguration.modificationDate = new Date();

      await queryRunner.manager.save(ConfigurationEntity, updatedConfiguration);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Could not save Configuration with id ${id}`);
    } finally {
      await queryRunner.release();
    }

    return { ...singleCableCalculation, ...{ configuration: updatedConfiguration } } as SingleCableCalculation;
  }

  public async removeChainflexDataTransactional(
    singleCableCalculation: SingleCableCalculation,
    modifiedBy: string
  ): Promise<SingleCableCalculation> {
    const id = singleCableCalculation.configurationId;
    let updatedConfiguration: Configuration;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const updatedWorkStepOverrides = removeChainflexRelatedOverrides(
        singleCableCalculation.configuration.state.workStepOverrides
      );

      await queryRunner.manager
        .createQueryBuilder()
        .update(ConfigurationEntity)
        .set({
          state: () => `
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  state,
                  '{"chainFlexState"}'::text[],
                  'null'::jsonb
                ),
                '{"pinAssignmentState"}'::text[],
                'null'::jsonb
              ),
              '{"workStepOverrides"}'::text[],
              '${JSON.stringify(updatedWorkStepOverrides)}'::jsonb
            )
          `,
        })
        .where('id = :id', { id })
        .returning('*')
        .updateEntity(true)
        .execute();

      updatedConfiguration = await queryRunner.manager.findOneBy<Configuration>(ConfigurationEntity, { id });

      updatedConfiguration.modifiedBy = modifiedBy;
      updatedConfiguration.modificationDate = new Date();

      await queryRunner.manager.save(ConfigurationEntity, updatedConfiguration);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Could not save Configuration with id ${id}`);
    } finally {
      await queryRunner.release();
    }

    return { ...singleCableCalculation, ...{ configuration: updatedConfiguration } } as SingleCableCalculation;
  }

  public findOneById(singleCableCalculationId: string): Promise<SingleCableCalculation> {
    return this.singleCableCalculationRepository.findOne({
      where: { id: singleCableCalculationId },
      relations: ['configuration', 'calculation', 'snapshot'],
    });
  }

  public findManyByIds(singleCableCalculationIds: string[]): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationRepository.find({
      where: { id: In(singleCableCalculationIds) },
      relations: ['configuration', 'calculation', 'snapshot'],
      order: {
        assignmentDate: 'ASC',
      },
    });
  }

  public createFromRepo(
    configuration: Configuration,
    calculation: Calculation,
    userId: string,
    batchSize: number,
    chainflexLength?: number,
    commercialWorkStepOverrides?: CommercialWorkStepOverrides
  ): SingleCableCalculation {
    return this.singleCableCalculationRepository.create({
      configuration,
      calculation,
      batchSize,
      chainflexLength,
      commercialWorkStepOverrides,
      assignedBy: {
        id: userId,
      },
    });
  }

  public createEntity(
    configurationId: string,
    calculationId: string,
    userId: string,
    batchSize?: number,
    chainflexLength?: number,
    assignmentDate?: Date
  ): SingleCableCalculationEntity {
    const sccEntity = new SingleCableCalculationEntity();

    Object.assign(sccEntity, {
      configurationId,
      calculationId,
      ...{ assignedBy: { id: userId } },
      batchSize,
      chainflexLength,
      assignmentDate,
    });
    return sccEntity;
  }

  public async findOneByCalculationIdAndConfigurationId(
    calculationId: string,
    configurationId: string
  ): Promise<SingleCableCalculation> {
    return this.singleCableCalculationRepository.findOne({
      where: {
        calculationId,
        configurationId,
      },
    });
  }

  public async findManyByCalculationIdAndConfigurationId(
    calculationId: string,
    configurationId: string
  ): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationRepository.find({
      where: {
        calculationId,
        configurationId,
      },
    });
  }

  public async findManyByCalculationIdAndSnapshotId(
    calculationId: string,
    snapshotId: string
  ): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationRepository.find({
      where: {
        calculationId,
        snapshotId,
      },
    });
  }

  public async findByConfigurationIds(configIds: string[]): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationRepository.find({
      where: {
        configurationId: In(configIds),
      },
    });
  }

  public async findBySnapshotIds(snapshotIds: string[]): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationRepository.find({
      where: {
        snapshotId: In(snapshotIds),
      },
    });
  }

  public async findByCalculationId(calculationId: string): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationRepository.find({
      where: {
        calculationId,
      },
    });
  }

  public async findByConfigurationId(configurationId: string): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationRepository.find({
      where: {
        configurationId,
      },
    });
  }

  public async findByConfigurationIdInSnapshot(configurationId: string): Promise<SingleCableCalculation[]> {
    return this.singleCableCalculationRepository.find({
      where: {
        snapshot: {
          isSnapshotOf: configurationId,
        },
      },
    });
  }

  public async findOneByCalculationId(calculationId: string): Promise<SingleCableCalculation> {
    const foundScc = await this.createQueryWithFullRelations()
      .where(`singleCableCalculation.calculationId = :calculationId`, { calculationId })
      .orderBy('singleCableCalculation.assignment_date', 'ASC')
      .getOne();

    return this.fetchSingleCableCalculationWithRelatedItems(foundScc);
  }

  public async findOneBySingleCableCalculationId(singleCableCalculationId: string): Promise<SingleCableCalculation> {
    const foundScc = await this.createQueryWithFullRelations()
      .where(`singleCableCalculation.id = :singleCableCalculationId`, { singleCableCalculationId })
      .orderBy('singleCableCalculation.assignment_date', 'ASC')
      .getOne();

    return this.fetchSingleCableCalculationWithRelatedItems(foundScc);
  }

  public async findOneByConfigurationId(configurationId: string): Promise<SingleCableCalculation> {
    const foundScc = await this.createQueryWithFullRelations()
      .where(`singleCableCalculation.configurationId = :configurationId`, { configurationId })
      // if the configuration is only assigned to locked calculations it will only by found by the configurationId in the snapshot
      .orWhere(`(snapshot.configuration_data ->> 'id')::uuid = :configurationId`, { configurationId })
      .orderBy('singleCableCalculation.assignment_date', 'ASC')
      .getOne();

    return this.fetchSingleCableCalculationWithRelatedItems(foundScc);
  }

  /*
   * This method finds all different related SingleCableCalculations based on an input SingleCableCalculation.
   * Based on the direct relations of SingleCableCalculation being calculation, configuration, snapshot it needs to query the SingleCableCalculations
   * related to each of these relations and combine them in one SingleCableCalculation object. As many simpler queries tend to be faster than one with deep joins and subqueries
   * this method tackles each of the relations at once and merges them in one response.
   */
  private async fetchSingleCableCalculationWithRelatedItems(
    scc: SingleCableCalculation
  ): Promise<SingleCableCalculation> {
    // builds manually an object in form of SingleCableCalculation
    return {
      ...scc,
      ...(scc.configuration && {
        configuration: await this.buildConfigurationWithRelations(scc.configuration),
      }),
      calculation: await this.buildCalculationWithRelations(scc.calculation),
      ...(scc.snapshot && {
        snapshot: await this.buildSnapshotWithRelations(scc.snapshot),
      }),
    };
  }

  private async buildCalculationWithRelations(calculation: Calculation): Promise<Calculation> {
    const sccOfCalculation = await this.createQueryWithSparseRelations()
      .where('singleCableCalculation.calculationId = :calculationId', { calculationId: calculation.id })
      .getMany();

    return {
      ...calculation,
      singleCableCalculations: [...sccOfCalculation],
    };
  }

  private async buildConfigurationWithRelations(configuration: Configuration): Promise<Configuration> {
    const sccOfConfig = await this.createQueryWithSparseRelations()
      .where('singleCableCalculation.configurationId = :configurationId', { configurationId: configuration.id })
      .getMany();

    const sccOfConfigSnapshot = await this.createQueryWithSparseRelations()
      .where('configSccSnapshot.isSnapshotOf = :configurationId', { configurationId: configuration.id })
      .getMany();

    return {
      ...configuration,
      singleCableCalculations: [...sccOfConfig, ...sccOfConfigSnapshot],
      snapshots: [],
    };
  }

  private async buildSnapshotWithRelations(snapshot: ConfigurationSnapshot): Promise<ConfigurationSnapshot> {
    const sccOfSnapshot = await this.createQueryWithSparseRelations()
      .where('singleCableCalculation.id = :id', { id: snapshot.singleCableCalculation?.id })
      .getOne();

    let sccsOfSnapshot = await this.createQueryWithSparseRelations()
      .where('singleCableCalculation.snapshotId = :snapshotId', { snapshotId: snapshot.id })
      .getMany();

    const sccOfSnapshotConfigurations = await this.createQueryWithSparseRelations()
      .where(
        'singleCableCalculation.configurationId = :isSnapshotOf OR configSccSnapshot.configurationMatNumber = :matNumber',
        { isSnapshotOf: snapshot.isSnapshotOf, matNumber: snapshot.configurationMatNumber }
      )
      .getMany();

    sccsOfSnapshot = sccsOfSnapshot.filter((value) => value.id !== sccOfSnapshot.id);

    const snapshotConfigurationPlaceholder = {
      singleCableCalculations: [...sccsOfSnapshot, ...sccOfSnapshotConfigurations],
    } as Configuration;

    return {
      ...snapshot,
      singleCableCalculation: sccOfSnapshot,
      configurations: snapshotConfigurationPlaceholder,
    };
  }

  private createQueryWithFullRelations(): SelectQueryBuilder<SingleCableCalculation> {
    return this.singleCableCalculationRepository
      .createQueryBuilder('singleCableCalculation')
      .leftJoinAndSelect('singleCableCalculation.configuration', 'config')
      .leftJoinAndSelect('singleCableCalculation.calculation', 'calc')
      .leftJoinAndSelect('singleCableCalculation.snapshot', 'snapshot')
      .leftJoin('snapshot.singleCableCalculation', 'snapshotScc')
      .addSelect(['snapshotScc.id']);
  }

  private createQueryWithSparseRelations(): SelectQueryBuilder<SingleCableCalculation> {
    return this.singleCableCalculationRepository
      .createQueryBuilder('singleCableCalculation')
      .leftJoin('singleCableCalculation.calculation', 'configSccCalc')
      .addSelect(['configSccCalc.id', 'configSccCalc.calculationNumber'])
      .leftJoin('singleCableCalculation.configuration', 'configSccConfig')
      .addSelect(['configSccConfig.id', 'configSccConfig.matNumber'])
      .leftJoin('singleCableCalculation.snapshot', 'configSccSnapshot')
      .addSelect([
        'configSccSnapshot.id',
        'configSccSnapshot.isSnapshotOf',
        'configSccSnapshot.configurationMatNumber',
      ]);
  }
}
