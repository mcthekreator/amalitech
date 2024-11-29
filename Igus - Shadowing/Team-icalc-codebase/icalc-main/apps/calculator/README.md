# ICalc

# Building

## Prerequisite Software

- [igus kopla local environment](https://igusdev.atlassian.net/wiki/display/KINF/Lokale+Entwicklungsumgebung)

## Installing NPM Modules

```shell
$ yarn install
```

# Distributing

Read about [branching & deployments](https://igusdev.atlassian.net/wiki/pages/viewpage.action?pageId=8224800)
Read about [linking and using npm packages](https://igusdev.atlassian.net/wiki/display/KOPLA10/NPM+Verlinkung)

# Developing

## Code Style

- [igus kopla code style](https://igusdev.atlassian.net/wiki/display/KOPLA10/Allgemeine+Konventionen#space-menu-link-content)

## Debugging

### Debug the tests

- [igus kopla best practices - debugging tests](https://igusdev.atlassian.net/wiki/display/KOPLA10/Best+practices#Bestpractices-Debugging)

## Creating Angular Modules

```shell
npx nx generate @nx/angular:component test123 --standalone
```

## Component Testing

To start component testing run:

```shell
nx component-test calculator
```

or

```shell
yarn test:component
```

To start component testing for specific file, replace the path and run:

```shell
nx component-test calculator --spec "apps/calculator/src/app/modules/features/chainflex/components/chainflex/chainflex.component.cy.ts"
```

To generate test file for a component run:

```shell
nx generate @nx/angular:component-test
```

More options for this command can be found in [official documentation](https://nx.dev/nx-api/angular/generators/component-test#nxangularcomponenttest)

## Creating translation files

- [I18N](https://igusdev.atlassian.net/wiki/display/KOPLA10/I18n)
- [Translation process](https://igusdev.atlassian.net/wiki/display/KOPLA10/Translation+process)

- `$ gulp i18n:genRepos` bundles all i18n files for translation in folder `i18n`.
- `$ gulp i18n:parseRepos` de-bundles translation bundles back to src folder.
- `$ gulp i18n:getS3TranslationsAndParseRepos` get translation from S3 and de-bundles translations back to src folder.

- `$ npm run i18n:download` download all i18n files from s3 (fromTranslation)
- `$ npm run i18n:parse` parse the translations in i18n root folder
- `$ npm run i18n:download:parse` combine download and parse translations
- `$ npm run i18n:generate` generates translations files that will be moved to s3 (toTranslation)
