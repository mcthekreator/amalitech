const {
  RDSClient,
  DescribeDBSnapshotsCommand,
  CreateDBSnapshotCommand,
  DeleteDBSnapshotCommand,
  InvalidDBInstanceStateFault,
  DBInstanceNotFoundFault,
  DBSnapshotAlreadyExistsFault,
  SnapshotQuotaExceededFault,
  waitUntilDBSnapshotAvailable,
} = require('@aws-sdk/client-rds');

// async to enable await and be able to handle network requests
async function main() {
  const environment = extractStringEnvVar('EC2_ENV');
  const icalcVersion = extractStringEnvVar('PACKAGE_VERSION');
  const client = new RDSClient({ region: 'eu-central-1' });
  const timeStamp = Date.now();
  const envDBInstanceIdentifier = `pg-kopla-${environment}`;
  const newDBSnapshotIdentifier = `icalc-pg-db-snapshot-${environment}-${timeStamp}`;

  const paramsDescribeSnapshots = {
    DBInstanceIdentifier: envDBInstanceIdentifier,
    SnapshotType: 'manual',
  };
  const paramsCreateSnapshot = {
    DBInstanceIdentifier: envDBInstanceIdentifier,
    DBSnapshotIdentifier: newDBSnapshotIdentifier,
    Tags: [
      {
        Key: 'PACKAGE_VERSION',
        Value: icalcVersion,
      },
    ],
  };
  const getSnapshotsCommand = new DescribeDBSnapshotsCommand(paramsDescribeSnapshots);
  const createSnapshotCommand = new CreateDBSnapshotCommand(paramsCreateSnapshot);

  console.log(`The backup process for ${newDBSnapshotIdentifier} will now be triggered in ${environment}`);

  // get previous snapshot
  const getSnapshotsResponse = await client.send(getSnapshotsCommand);
  const previousSnapshotsWithTags = getSnapshotsResponse.DBSnapshots?.filter((snapshot) => {
    return snapshot.TagList[0]?.Key === 'PACKAGE_VERSION';
  });

  // initial snapshot creation
  if (!previousSnapshotsWithTags || previousSnapshotsWithTags.length === 0) {
    // try to create a new snapshot
    await createSnapshotAndWaitUntilAvailable(
      client,
      createSnapshotCommand,
      getSnapshotsCommand,
      newDBSnapshotIdentifier
    );

    const message = `No previous snapshot was found, skipping the "delete previous snapshot"-part`;
    console.log(message);
    console.log(`The backup process finished successfully. ${newDBSnapshotIdentifier} was created in ${environment}`);
    // ends this script
    process.exit(0);
  }

  // skip creating snapshots if previous snapshot has the same icalcVersion
  const previousSnapshot = previousSnapshotsWithTags[0];
  const previousSnapshotTag = previousSnapshot.TagList[0];
  if (environment === 'integration' && previousSnapshotTag.Value === icalcVersion) {
    const message = `The backup process skipped on ${environment}, because the iCalc Version(${icalcVersion}) did not change.`;
    console.log(message);
    // ends this script
    process.exit(0);
  }

  // try to create a new snapshot
  await createSnapshotAndWaitUntilAvailable(
    client,
    createSnapshotCommand,
    getSnapshotsCommand,
    newDBSnapshotIdentifier
  );

  // delete previous snapshot
  const previousSnapshotIdentifier = previousSnapshot.DBSnapshotIdentifier;
  const paramsDeleteSnapshot = {
    DBInstanceIdentifier: envDBInstanceIdentifier,
    DBSnapshotIdentifier: previousSnapshotIdentifier,
  };
  const deleteSnapshotCommand = new DeleteDBSnapshotCommand(paramsDeleteSnapshot);
  await client.send(deleteSnapshotCommand);
  console.log(`The backup process finished successfully. ${newDBSnapshotIdentifier} was created in ${environment}`);
}

const extractStringEnvVar = (key) => {
  const value = process.env[key];

  if (!value) {
    const message = `The backup process aborted, because the environment variable "${key}" cannot be "undefined".`;
    console.log(message);
    throw new Error(message);
  }
  return value;
};

async function createSnapshotAndWaitUntilAvailable(client, command, describeCommand, newSnapshotIdentifier) {
  try {
    await client.send(command);
  } catch (e) {
    if (
      e instanceof InvalidDBInstanceStateFault ||
      e instanceof DBInstanceNotFoundFault ||
      e instanceof DBSnapshotAlreadyExistsFault ||
      e instanceof SnapshotQuotaExceededFault
    ) {
      const message = `The backup process aborted, the snapshot creation failed: ${e.message}`;
      throw new Error(message);
    } else {
      const message = `The backup process aborted, the snapshot creation failed: ${e}`;
      throw new Error(message);
    }
  }
  try {
    const waiterResult = await waitUntilDBSnapshotAvailable(
      { client: client, maxWaitTime: 600, minDelay: 30, maxDelay: 60 },
      { ...describeCommand, DBSnapshotIdentifier: newSnapshotIdentifier }
    );
    if (waiterResult.state === 'SUCCESS') {
      console.log(
        `The snapshot creation state is: ${waiterResult.state} . The reason is: ${JSON.stringify(waiterResult.reason)}`
      );
    } else {
      const message = `The backup process aborted, because the snapshot creation state is: ${
        waiterResult.state
      } . The reason is: ${JSON.stringify(waiterResult.reason)}`;
      throw new Error(message);
    }
  } catch (e) {
    const message = `The backup process aborted, the snapshot creation failed: ${e}`;
    throw new Error(message);
  }
}

main();
