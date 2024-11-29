export const postgresEnvironment = {
  getDevelopment: () => {
    return {
      postgresDatabase: process.env.POSTGRES_DATABASE,
      postgresHost: process.env.POSTGRES_HOST,
      postgresPassword: process.env.POSTGRES_PASSWORD,
      postgresPort: Number(process.env.POSTGRES_PORT),
      postgresUser: process.env.POSTGRES_USER,
      isLocal: true,
    };
  },
  integration: {
    postgresDatabase: 'icalc',
    postgresHost: 'pg-kopla-integration.cp1zhzmzaurp.eu-central-1.rds.amazonaws.com',
    postgresPort: 5432,
    postgresUser: 'kopla_icalc_pg',
    postGresRegion: 'eu-central-1',
    isLocal: false,
  },
  staging: {
    postgresDatabase: 'icalc',
    postgresHost: 'pg-kopla-staging.cp1zhzmzaurp.eu-central-1.rds.amazonaws.com',
    postgresPort: 5432,
    postgresUser: 'kopla_icalc_pg',
    postGresRegion: 'eu-central-1',
    isLocal: false,
  },
  production: {
    postgresDatabase: 'icalc',
    postgresHost: 'pg-kopla-production.cp1zhzmzaurp.eu-central-1.rds.amazonaws.com',
    postgresPort: 5432,
    postgresUser: 'kopla_icalc_pg',
    postGresRegion: 'eu-central-1',
    isLocal: false,
  },
};
