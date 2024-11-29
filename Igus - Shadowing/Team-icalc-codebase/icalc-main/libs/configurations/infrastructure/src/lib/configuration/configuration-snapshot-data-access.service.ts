import type {
  ConfigurationSnapshot,
  ConfigurationSnapshotData,
  WorkStepPricesValuesByWorkStepSet,
} from '@igus/icalc-domain';
import { ConfigurationSnapshotEntity } from '@igus/icalc-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { In, Repository } from 'typeorm';

@Injectable()
export class ConfigurationSnapshotDataAccessService {
  constructor(
    @InjectRepository(ConfigurationSnapshotEntity, ICALC_CONNECTION)
    private readonly configurationSnapshotRepository: Repository<ConfigurationSnapshot>
  ) {}

  public createFromRepo(configurationSnapshot: Partial<ConfigurationSnapshot>): ConfigurationSnapshot {
    return this.configurationSnapshotRepository.create({
      ...configurationSnapshot,
      creationDate: new Date(),
      modificationDate: new Date(),
    });
  }

  public createEntity(
    isSnapshotOf: string,
    workStepPrices: WorkStepPricesValuesByWorkStepSet,
    configurationData: ConfigurationSnapshotData,
    userId: string
  ): ConfigurationSnapshotEntity {
    const snapshotEntity = new ConfigurationSnapshotEntity();

    Object.assign(snapshotEntity, {
      isSnapshotOf,
      workStepPrices,
      configurationData,
      configurationMatNumber: configurationData.matNumber,
      createdBy: { id: userId },
      modifiedBy: { id: userId },
    });
    return snapshotEntity;
  }

  public async findOneById(id: string): Promise<ConfigurationSnapshot> {
    return this.configurationSnapshotRepository.findOneBy({
      id,
    });
  }

  public async findManyByIds(ids: string[]): Promise<ConfigurationSnapshot[]> {
    return this.configurationSnapshotRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  public async findManyByIsSnapshotOf(ids: string[]): Promise<ConfigurationSnapshot[]> {
    return this.configurationSnapshotRepository.find({
      where: {
        isSnapshotOf: In(ids),
      },
    });
  }

  public async save(configuration: Partial<ConfigurationSnapshot>): Promise<ConfigurationSnapshot> {
    return this.configurationSnapshotRepository.save(configuration);
  }
}
