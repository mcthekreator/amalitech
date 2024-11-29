# iCalc Data Service

The `iCalc Data Service` delivers igus data as JSON objects via REST service

## Building

### Prerequisite Software

# to do

- [igus kopla local environment](https://igusdev.atlassian.net/wiki/display/KINF/Lokale+Entwicklungsumgebung)

### Installing NPM Modules

```shell
$ yarn install
```

### On docker

```shell
# to build the application locally
yarn nx build data-service --configuration production

# to build the application locally on docker
yarn nx docker-local data-service
```

## Distributing

Read about [branching & deployments](https://igusdev.atlassian.net/wiki/pages/viewpage.action?pageId=8224800)
Read about [linking and using npm packages](https://igusdev.atlassian.net/wiki/display/KOPLA10/NPM+Verlinkung)

To distribute for npm, run `$ npm run dist` and use the build in folder `dist`.

## Developing

For detailed API information, read [TypeDoc online documentation](https://typedoc.igusdev.igus.de/kopla_domain/)

## Code Style

- [igus kopla code style](https://igusdev.atlassian.net/wiki/display/KOPLA10/Allgemeine+Konventionen#space-menu-link-content)

## Generating the API documentation

- `$ npm run doc` to generate the documentation

## Folder structure

- `dist/*`: Files for distribution.
- `coverage/*`: Genarated coverage.
- `doc/*`: Generated documentation.
- `src/*`: Typescript files to develop.
- `tools/*`: Tools for building, testing and maintaining the project

## Debugging

### Debug the tests

- [igus kopla best practices - debugging tests](https://igusdev.atlassian.net/wiki/display/KOPLA10/Best+practices#Bestpractices-Debugging)

To run the data-service local you need a elasticsearch locally. See [Setup local development environment](https://igusdev.atlassian.net/wiki/spaces/KDEV/pages/1540107/Setup+local+development+environment) for details.
To make it short: Run docker-compose.yml (in @igus/kopla-data) on your local docker.
