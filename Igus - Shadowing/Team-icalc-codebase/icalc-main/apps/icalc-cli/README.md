# icalc-cli

### Build CLI application via yarn:

```shell
yarn build:cli
```

### Start CLI application via yarn:

```shell
yarn start:cli
```

### Help

You can use `-h` or `--help` on all following commands to get additional help information for each command.

---

## db-local-user: Generate local icalc user

You have to provide an email address and a password.

```shell
yarn db:local-user <email> <password>
```

You can also optionally pass values for first name, las name and role. Otherwise these will be set with default values.

```shell
yarn db:local-user <email> <password> -f [firstName] -l [lastName] -r [role]
```

---

## mat017-item-update: Update Mat017 items & usages

To update mat017Items in icalc from CSV files, use following command.

```shell
yarn mat017-item-update
```

To fetch mat017Items from IERP Service and update in Icalc you can use following commad. Note that `--update` flag is optional. Without this flag the mat017Items will only be fetched from IERP but not saved in Icalc.

```shell
yarn mat017-item-update fetch-from-ierp --mat017Items --update
```

The `--dryRun` flag shows which items would be updated without executing the update.

```shell
yarn mat017-item-update fetch-from-ierp --mat017Items --update --dryRun
```

To fetch and update usages, following command can be used.

```shell
yarn mat017-item-update fetch-from-ierp --usages --update
```

Updating single mat017Item from Ierp is currently not supported but you can fetch one mat017Item by a matNumber.

```shell
yarn mat017-item-update fetch-from-ierp --mat017Item=MAT017Number
```

Following command will fetch all mat017Items from Ierp service and compare them with CSV file generated from a business unit excel file. This CSV file needs to be added manually on your local machine under `apps/data-import/csv-files/MAT017_item_bu_excel.csv`

```shell
yarn mat017-item-update compare-ierp-to-business-unit-excel
```

The additional flag `--notIncludedInBusinessUnitExcelFile` can be passed to display only the matNumbers of mat017Items from the IERP Service that are not included in the local business unit Excel file.

```shell
yarn mat017-item-update compare-ierp-to-business-unit-excel --notIncludedInBusinessUnitExcelFile
```

## delete-mat017-test-item-widen-images: Delete Mat017 test item images from widen

```shell
yarn delete-mat017-test-item-widen-images
```

---

## db-seed: Generate test data

```shell
yarn db:seed [sub-command] [individualArguments] [individualOptions]
```

### **Icalc test user**

Generate icalc test user with:

```shell
yarn db:seed user
```

### **Basic sets of test data**

_icalc test user required_

Generate basic set of test data (calculation, configuration, scc, status) with:

```shell
yarn db:seed calculation-and-configuration
```

To generate different kinds of test data sets you can use the following flags:

- a calculation with **two assignments** of the same configuration

```shell
yarn db:seed calculation-and-configuration --manyAssignments
```

- a calculation with one configuration assignment without overrides

```shell
yarn db:seed calculation-and-configuration --withoutOverrides
```

- a calculation with an updated chainflex price in the calculation
- also works with `--manyAssignments` Flag

```shell
yarn db:seed calculation-and-configuration --updatedChainflexPrice
```

- a calculation with an removed chainflex in the calculation
- - also works with `--manyAssignments` Flag

```shell
yarn db:seed calculation-and-configuration --removedChainflex
```

- a calculation with one **invalid/incomplete** configuration assignment
- also works with `--manyAssignments` Flag

```shell
yarn db:seed calculation-and-configuration --incomplete
```

- a calculation with one configuration assignment **designated for locking** during tests

```shell
yarn db:seed calculation-and-configuration --forLocking
```

- a calculation with two configuration assignment **designated for assignment removal** during tests

```shell
yarn db:seed calculation-and-configuration --forRemoval
```

- a **locked** calculation with one configuration assignment

```shell
yarn db:seed calculation-and-configuration --locked
```

- a **locked** calculation with **two assignments** of the same configuration

```shell
yarn db:seed calculation-and-configuration --locked --manyAssignments
```

### **Delete test data**

_icalc test user required_

Delete all test data (except user) with:

```shell
yarn db:seed delete-testdata
```
