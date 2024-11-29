# iCalc

The repository for the iCalc software.

## Getting Started

The Setup of this project requires additional steps.
The full Setup Guide can be found [here](GETTINGSTARTED.md).

## Coding Guideline

### Creation of Angular Components, Services, etc.

Components, Services and other Angular stuff is best generated via `nx`
e.g.:

```
nx generate component order
```

For more information refer to:

```shell
nx generate --help
```

### Versioning & Commit strategy

[Read this](https://igusdev.atlassian.net/wiki/spaces/ICALC/pages/4734386455/Infrastructure+versioning+automatic+deploy+to+servers) before development!

This project uses [Conventional Commits](https://www.conventionalcommits.org), please remember that when creating commits and during the merge of PR.

### Link to full Coding Guide

[DEV Guide](https://igusdev.atlassian.net/wiki/spaces/ICALC/pages/4089315505/DEV+Guide)

## Start the Application

on docker:

```shell
# to start frontend and backend in detached mode
yarn start:docker

# to start frontend on docker and attach to it
yarn start:frontend:docker

# to start backend on docker and attach to it
yarn start:services:docker

# if you want explicitly build the images
yarn start:docker --build
```

on your machine:

```shell
# start frontend
yarn start:frontend

# start data-service
yarn start:services
```

## Run Tests

### run with native runners

one option to run all tests are yarn test

```shell
yarn test
```

another one is to run the predefined goal

```shell
nx run calculator:test
```

### run component test

to run component tests please refer to the [README](./apps/calculator/README.md#component-testing)

### run e2e test

to run e2e tests please refer to the [README](apps/calculator-e2e/README.md) of the calculator-e2e project

### run all tests and create test report (coverage)

```shell
yarn test:report
```

After running the command you should see both an "/e2e" and a "/unit" folder in /coverage. Use the index.html files in these folders get an overview of the current coverage.

### run with lerna

Run commands in changed packages only
Before you commit you can run the tests of all changed packages since the last git tag:

```sh
yarn lerna exec 'npm -v'
```

or if you want to run commands in all packages that have changed since `some-branch`. This is useful for feature-branches.

```sh
yarn lerna exec <some-branch> 'npm -v'
```

## Additional links

- [Monorepo Introduction](https://igusdev.atlassian.net/wiki/spaces/KDEV/pages/1232404538/Monorepo)
- [Repository](https://github.com/igusdev/icalc/)

## Questions

Feel free to ask question in the `Kopla Core` Hipchat room.

## Known Issues

-

## Release

```sh
# mark a new release
yarn bump
```
