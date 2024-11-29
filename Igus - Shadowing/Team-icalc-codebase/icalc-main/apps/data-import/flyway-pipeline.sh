#!/bin/bash
set -e
PWD=$(pwd);
SQLDIR=${PWD}/apps/data-import/data-base/postgres/sql
if [ ! -d ${SQLDIR} ]
then
    echo "Error Directory ${SQLDIR} DOES NOT exists."
    exit 9999 # die with error code 9999
fi

# debug
echo "using sql directory" ${SQLDIR}

echo "contents of the local flyway sql directory:"
ls ${SQLDIR};

HOSTNAME=pg-kopla-${EC2_ENV}.cp1zhzmzaurp.eu-central-1.rds.amazonaws.com
if [ $EC2_ENV = "staging" ]
then
token=$(aws rds generate-db-auth-token --hostname ${HOSTNAME} --port 5432 --region eu-central-1 --username kopla_icalc_pg);
echo "starting flyway migration via docker in" ${EC2_ENV}
docker run --rm -v ${SQLDIR}:/flyway/sql flyway/flyway:10.14.0 -url=jdbc:postgresql://${HOSTNAME}:5432/icalc -password=$token -user=kopla_icalc_pg migrate
elif [ $EC2_ENV = "integration" ]
then
token=$(aws rds generate-db-auth-token --hostname ${HOSTNAME} --port 5432 --region eu-central-1 --username kopla_icalc_pg);
echo "starting flyway migration via docker in" ${EC2_ENV}
docker run --rm -v ${SQLDIR}:/flyway/sql flyway/flyway:10.14.0 -url=jdbc:postgresql://${HOSTNAME}:5432/icalc -password=$token -user=kopla_icalc_pg migrate
elif [ $EC2_ENV = "production" ]
then
token=$(aws rds generate-db-auth-token --hostname ${HOSTNAME} --port 5432 --region eu-central-1 --username kopla_icalc_pg);
echo "starting flyway migration via docker in" ${EC2_ENV}
docker run --rm -v ${SQLDIR}:/flyway/sql flyway/flyway:10.14.0 -url=jdbc:postgresql://${HOSTNAME}:5432/icalc -password=$token -user=kopla_icalc_pg migrate
else
    echo "configuration for this environment does not exist:" ${EC2_ENV}
    exit 9999 # die with error code 9999
fi

