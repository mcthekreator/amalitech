# Cypress

### Prerequisites

- The backend service (data-service) has to be running (local), to be able to run all tests successfully.

```shell
yarn start:services
```

- The CLI (icalc-cli) has to be build.

```shell
yarn build:cli
```

### Run Cypress Tests

```shell
nx run calculator-e2e:e2e
```

### Run Cypress Tests for specific .cy.ts/.feature files

```shell
nx e2e calculator-e2e --spec "apps/calculator-e2e/src/tests/integration/meta-data.cy.ts"
```

### Run Cypress Tests in Watch Mode

```shell
nx run calculator-e2e:e2e --watch
```

### Run Cypress Cucumber Tests

```shell
ENABLE_CUCUMBER_ICALC_579=true nx run calculator-e2e:e2e
```

### Run Cypress Cucumber Tests in Watch Mode

```shell
ENABLE_CUCUMBER_ICALC_579=true nx run calculator-e2e:e2e --watch
```

### Run Cypress Cucumber Tests for specific Feature Files

```shell
ENABLE_CUCUMBER_ICALC_579=true nx run calculator-e2e:e2e --spec apps/calculator-e2e/src/tests/e2e/MetaData.feature
```

### Run Cypress Cucumber Specific Test Case in a Feature File

```shell
@only
Scenario: ...
```

### Pipeline Debugging

As a workaround to show logs while running Cypress headlessly, you can use the following:

```typescript
cy.screenshot(JSON.stringify(somethingYouWantToLog, null, 4), { capture: 'runner' });
```

This will create a screenshot of the log which can be accessed locally in the dist folder and is directly accessible in jenkins.

## To run a test multiple times for debugging

Cypress.\_.times(5, () => {
// insert it()-block with test here which you want to start multiple times
} );
