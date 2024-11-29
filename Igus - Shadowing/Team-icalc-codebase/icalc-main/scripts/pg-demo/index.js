const { Signer } = require('@aws-sdk/rds-signer');
const { Client } = require('pg');
const fs = require('node:fs');

const getDBConfig = async () => {
  const username = 'kopla_icalc_pg';
  const hostname = 'pg-kopla-integration.cp1zhzmzaurp.eu-central-1.rds.amazonaws.com';
  const port = 5432;

  const token = await new Signer({
    region: 'eu-central-1',
    username,
    hostname,
    port,
  }).getAuthToken();

  return {
    user: username,
    host: hostname,
    port,
    password: token,
    database: 'icalc',
    ssl: {
      ca: fs.readFileSync('./global-bundle.pem').toString(),
    },
  };
};
const main = async () => {
  const dbConfig = await getDBConfig();

  const client = new Client(dbConfig);
  await client.connect();
  console.log('Connection established!');

  const res = await client.query('SELECT $1::text as message', ['Hello world, computed from inside of pg!']);
  console.log(res.rows[0].message);

  await client.end();
};
main().then(() => {
  console.log('Done');
});
