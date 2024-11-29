# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.8.0](https://github.com/igusdev/icalc/compare/v2.7.1...v2.8.0) (2024-09-11)

**Note:** Version bump only for package @igus/icalc-cli

## [2.4.0](https://github.com/igusdev/icalc/compare/v2.3.0...v2.4.0) (2024-06-13)

### Features

- add filter for manually created Mat017 items (ICALC-625) ([#560](https://github.com/igusdev/icalc/issues/560)) ([02400e4](https://github.com/igusdev/icalc/commit/02400e4fa90ac9b6c51dc6dee565fb730bf35f9f))
- integrate iERP service and automate data import (ICALC-127, [#569](https://github.com/igusdev/icalc/issues/569)) ([50e767d](https://github.com/igusdev/icalc/commit/50e767d5d27a0960055414efd148c4f8feeabac0))

### Bug Fixes

- **calculator-e2e, icalc-cli:** ensure elements are clickable and disable icalc-cli logs (CALC-636) ([#572](https://github.com/igusdev/icalc/issues/572)) ([b708ac4](https://github.com/igusdev/icalc/commit/b708ac4d60c55096a8feecdc10f7ac8722ff48ab))
- **libs:** add jwt expiration times and bump version v2.3.2 (ICALC-637) ([#575](https://github.com/igusdev/icalc/issues/575)) ([41b6ee7](https://github.com/igusdev/icalc/commit/41b6ee746f8f06f9b2f8c7b9225fae9ba4831e03))

### Reverts

- Revert "v2.3.4" ([c35ba61](https://github.com/igusdev/icalc/commit/c35ba61a906077b66ca04972b5da5aed8ebeb897))
- Revert "v2.4.0" ([5050c62](https://github.com/igusdev/icalc/commit/5050c6229068272c42af40711c60514233d31edf))

## [2.3.2](https://github.com/igusdev/icalc/compare/v2.3.1...v2.3.2) (2024-05-31)

**Note:** Version bump only for package @igus/icalc-cli

## [2.3.1](https://github.com/igusdev/icalc/compare/v2.3.0...v2.3.1) (2024-05-14)

**Note:** Version bump only for package @igus/icalc-cli

## [2.3.0](https://github.com/igusdev/icalc/compare/v2.2.0...v2.3.0) (2024-05-06)

### Features

- introduce business handling for updating mat017Items (ICALC-469) ([#515](https://github.com/igusdev/icalc/issues/515)) ([1538248](https://github.com/igusdev/icalc/commit/15382482ed15f1478a0c777d9676010c21f802aa))

### Bug Fixes

- **calculator-e2e, icalc-cli:** increase query timeout and add logging (ICALC-607/ICALC-608) ([#534](https://github.com/igusdev/icalc/issues/534)) ([36b83d9](https://github.com/igusdev/icalc/commit/36b83d9292009396963e2c33d57b46bfabce90d5))
- **calculator, calculator-e2e:** enhance pin assignments of MAT017 items (ICALC-474, ICALC-559) ([#494](https://github.com/igusdev/icalc/issues/494)) ([754327b](https://github.com/igusdev/icalc/commit/754327b0029c62dfb9485b08fdc06185509f083d))

## [2.2.0](https://github.com/igusdev/icalc/compare/v2.1.0...v2.2.0) (2024-01-16)

### Features

- change rds signer certificate to global-bundle (ICALC-479) ([#452](https://github.com/igusdev/icalc/issues/452)) ([d8dcaf0](https://github.com/igusdev/icalc/commit/d8dcaf0eff3715db73e02aa7e44573efbff9d0b0))

## [2.0.0](https://github.com/igusdev/icalc/compare/v1.16.0...v2.0.0) (2023-11-27)

**Note:** Version bump only for package @igus/icalc-cli

## [1.15.0](https://github.com/igusdev/icalc/compare/v1.14.0...v1.15.0) (2023-10-10)

**Note:** Version bump only for package @igus/icalc-cli

## [1.14.0](https://github.com/igusdev/icalc/compare/v1.13.0...v1.14.0) (2023-08-10)

### Features

- allow only one snapshot of given config within a calculation (ICALC-362) ([#372](https://github.com/igusdev/icalc/issues/372)) ([e23d8e6](https://github.com/igusdev/icalc/commit/e23d8e6a7c4f2253097031b50430551c712bc096))
- remove assignments between calcs and confs (ICALC-255, [#382](https://github.com/igusdev/icalc/issues/382)) ([83de54b](https://github.com/igusdev/icalc/commit/83de54bfb620558d7685d2fa1867de79156af831))
- track and show who worked on calcs configs (ICALC-246, [#364](https://github.com/igusdev/icalc/issues/364)) ([9d3d8ea](https://github.com/igusdev/icalc/commit/9d3d8ea7d38d6c90d5261baceeb9f55e20445286))

### Bug Fixes

- ensure approval is not revoked and pin assignment image is saved correctly (ICALC-330, ICALC-454) ([#394](https://github.com/igusdev/icalc/issues/394)) ([631a02b](https://github.com/igusdev/icalc/commit/631a02b22fb8fa28ad8b0b4121503d2ecb7669df))

## [1.13.0](https://github.com/igusdev/icalc/compare/v1.12.0...v1.13.0) (2023-07-03)

### Features

- upgrade to kopla 11 and nx16 [ICALC-366] ([#359](https://github.com/igusdev/icalc/issues/359)) ([4504392](https://github.com/igusdev/icalc/commit/45043926a9a3d88dae375084de521ece21809b9e))

### Bug Fixes

- **ci:** fix resolve module not found issue [ICALC-366] ([#361](https://github.com/igusdev/icalc/issues/361)) ([79a98a5](https://github.com/igusdev/icalc/commit/79a98a58b2d12f693079bced1b9ca2ceb271d847))

# [1.12.0](https://github.com/igusdev/icalc/compare/v1.11.0...v1.12.0) (2023-06-13)

### Features

- (ICALC-307) tests for locking calculations ([#340](https://github.com/igusdev/icalc/issues/340)) ([0ae9923](https://github.com/igusdev/icalc/commit/0ae9923b481b9d4cf9928ff71124c5e619eaeaca))

# [1.9.0](https://github.com/igusdev/icalc/compare/v1.8.0...v1.9.0) (2023-04-27)

**Note:** Version bump only for package @igus/icalc-cli

# [1.8.0](https://github.com/igusdev/icalc/compare/v1.7.0...v1.8.0) (2023-04-03)

### Bug Fixes

- **icalc-cli:** properly distribute rds certificate ([#297](https://github.com/igusdev/icalc/issues/297)) ([daf7399](https://github.com/igusdev/icalc/commit/daf7399c0c2f39b4db207f286136f22ac3a16088))

### Features

- icalc 273/cli for db seeding ([#287](https://github.com/igusdev/icalc/issues/287)) ([f2925b0](https://github.com/igusdev/icalc/commit/f2925b093790add78526dfc071e09e1698336677))
- **icalc-240:** calculations and configurations ([#290](https://github.com/igusdev/icalc/issues/290)) ([78db8bc](https://github.com/igusdev/icalc/commit/78db8bcd297cc5abfb2dfbec5220cf531e853b56))
