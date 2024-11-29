import type { Mat017ItemUsage } from '@igus/icalc-domain';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DATABASE_CHUNK_SIZE, ICALC_CONNECTION } from '@igus/icalc-common';
import { DataSource, Repository } from 'typeorm';
import { Mat017ItemUsageEntity } from '@igus/icalc-entities';

@Injectable()
export class Mat017ItemUsageDataAccessService {
  constructor(
    @InjectRepository(Mat017ItemUsageEntity, ICALC_CONNECTION)
    private readonly mat017ItemUsageRepository: Repository<Mat017ItemUsage>,
    @InjectDataSource(ICALC_CONNECTION)
    private readonly dataSource: DataSource
  ) {}

  public async createMany(mat017ItemUsages: Mat017ItemUsage[]): Promise<Mat017ItemUsage[]> {
    return this.mat017ItemUsageRepository.save(mat017ItemUsages, { chunk: DATABASE_CHUNK_SIZE });
  }

  public async clear(): Promise<void> {
    return this.mat017ItemUsageRepository.clear();
  }
}
