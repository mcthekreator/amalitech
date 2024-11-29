# Data Import

All commands in this file should be executed from `/icalc` project folder

## Run Postgres DB, Adminer and migrate DB

To run Postgres DB, Adminer and migrate the DB to latest version run:

```bash
yarn start:database
```

## Build and Run Postgres/Adminer Container

```bash
docker compose -f ./apps/data-import/data-base/postgres/docker-compose.yml up db adminer -d
```

You can view the DB via Adminer tool on (http://localhost:8080).  
Access: icalc/icalc/icalc

## Flyaway Migration

To initiate the data import process run:

```shell
yarn build:database
```

## Import Chainflex items

To import chainflex items into the local database from Akeneo follow these steps:

Open [this file](../data-service/src/services/app-init.service.ts),
Navigate to the function `onApplicationBootstrap` and remove the `return` statement underneath the conditional block `if (environment.env === 'development')`.

It should look like this:

```bash
    if (environment.env === 'development') {
    //   return;
    }
```

Run following to start importing data from Akeneo:

```shell
yarn start:services
```

The service will access Akeneo and fetch the chainflex items.
After the import has successfully finished you can stop the server.

# Clearing the database

## Optional: Clean database (local) - this deletes your local database

Before executing the command, you need to change the "FLYWAY_CLEAN_DISABLED" Property in [docker-compose.yml](data-base/postgres/docker-compose.yml) to false.

on Mac / Linux

```bash
yarn clean:database
```

## Delete local calculations data via Adminer

To clear local calculations execute following on the database via Adminer:

```sql
DELETE FROM "single_cable_calculation";
DELETE FROM "calculation_configuration_status";
DELETE FROM "configuration_snapshot";
DELETE FROM "configuration";
DELETE FROM "calculation";
```
