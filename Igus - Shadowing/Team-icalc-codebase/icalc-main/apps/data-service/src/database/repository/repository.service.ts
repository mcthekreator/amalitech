import type { SearchResponse } from '@igus/kopla-data';
import { ElasticsearchCrudClient } from '@igus/kopla-data';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseIndexException, DatabaseQueryException } from '../../error';
import { DatabaseService } from '../database.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
type Entity = { Id: string };

type Terms<T> = { [key in keyof T]?: string[] };

type EntityParams<T> = { [key in keyof T]?: string };

type Must<T> =
  | {
      terms: Terms<T>;
    }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  | { match_all: Record<string, unknown> };

interface Bool<T> {
  must: Must<T>[];
}

interface GetOneParams {
  id: string;
  schemaVersion?: string;
}

type GetManyParams<T> = EntityParams<T> & {
  schemaVersion?: string;
};

interface ElasticError {
  path: string;
  response: string;
  type: string;
}

interface ElasticErrorResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error: Error & { type: string; failed_shards: { reason: { caused_by: { reason: string } } }[] };
}

@Injectable()
export class RepositoryService<T extends Entity> {
  protected tableName = '';
  protected schemaVersion = '';

  constructor(private readonly dbService: DatabaseService) {}

  /**
   * Gets one entity from database based on name
   */
  public async getOne({ id, schemaVersion }: GetOneParams): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return (await this.getAll({ Id: id, schemaVersion }))[0];
  }

  /**
   * Gets all entities from the database based on properties
   */
  public async getAll({ schemaVersion, ...params }: GetManyParams<T>): Promise<T[]> {
    type ParamsKey = keyof typeof params;

    const must: Must<T>[] = [];
    const bool: Bool<T> = { must };

    (Object.keys(params) as ParamsKey[])
      .filter((key) => !!params[key])
      .forEach((key) => must.push({ terms: { [key]: (params[key] as string).split(',') } as Terms<T> }));

    if (!must.length) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      must.push({ match_all: {} });
    }

    try {
      const result = (
        (
          await this.dbService.client.search({
            body: { query: { bool } },
            index: this.resourceName(schemaVersion),
            type: '_doc',
            sort: ['_id'],
            size: ElasticsearchCrudClient.FETCH_MAX_RECORDS,
          })
        ).body as SearchResponse<T>
      ).hits.hits.map(({ _source }) => _source);

      return result;
    } catch (err) {
      if ((err as ElasticError).response && (err as ElasticError).path) {
        const response = JSON.parse((err as ElasticError).response) as ElasticErrorResponse;
        const error = response.error;
        const shards = error.failed_shards;

        if (shards) {
          throw new DatabaseQueryException(shards[0].reason.caused_by.reason);
        } else if (error.type === 'index_not_found_exception') {
          throw new DatabaseIndexException();
        }
      } else if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(err);
    }
  }

  private resourceName(schemaVersion: string = this.schemaVersion): string {
    return this.dbService.namer.getResourceName(this.tableName, schemaVersion, false);
  }
}
