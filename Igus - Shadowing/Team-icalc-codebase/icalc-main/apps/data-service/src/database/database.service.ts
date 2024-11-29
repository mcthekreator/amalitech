import { Client } from '@elastic/elasticsearch';
import { ElasticsearchContextAwareResourceNameBuilder } from '@igus/kopla-data';
import { Injectable } from '@nestjs/common';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';

const { appName, env: koplaEnv } = getEnvironment();
const nodes = ['http://localhost:9200'];

@Injectable()
export class DatabaseService {
  public readonly client = new Client({ nodes });
  public readonly namer = new ElasticsearchContextAwareResourceNameBuilder(appName, koplaEnv);
}
