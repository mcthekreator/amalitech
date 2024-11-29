import 'reflect-metadata';

import { postgresEnvironment } from '@igus/icalc-postgres';
import { DataSource } from 'typeorm';

const postgresVariables = postgresEnvironment.getDevelopment();

export const appDataSource = new DataSource({
  type: 'postgres',
  host: postgresVariables.postgresHost,
  port: postgresVariables.postgresPort,
  username: postgresVariables.postgresUser,
  password: postgresVariables.postgresPassword,
  database: postgresVariables.postgresDatabase,
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
});
