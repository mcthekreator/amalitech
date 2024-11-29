# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.8.0](https://github.com/igusdev/icalc/compare/v2.7.1...v2.8.0) (2024-09-11)

### Features

- **calculator, libs:** show correct chainflex number of cores and nominal cross section in excel (ICALC-767) ([#667](https://github.com/igusdev/icalc/issues/667)) ([260e76b](https://github.com/igusdev/icalc/commit/260e76b61048ae88911ef484eea60002f3c115c9))

## [2.7.0](https://github.com/igusdev/icalc/compare/v2.6.0...v2.7.0) (2024-08-15)

### Features

- **data-import, libs:** add quote number and customer field to calculation entity (ICALC-712) ([#637](https://github.com/igusdev/icalc/issues/637)) ([d486b7f](https://github.com/igusdev/icalc/commit/d486b7f6560dcabf33a3d43942d32ba23de89ed6))

## [2.5.0](https://github.com/igusdev/icalc/compare/v2.4.2...v2.5.0) (2024-07-02)

**Note:** Version bump only for package @igus/icalc-entities

## [2.4.0](https://github.com/igusdev/icalc/compare/v2.3.0...v2.4.0) (2024-06-13)

### Features

- change date type to timestamptz to solve date inconsistency (ICALC-618) ([#576](https://github.com/igusdev/icalc/issues/576)) ([73af781](https://github.com/igusdev/icalc/commit/73af7813fe56227c89b6bc5e17537c97341769e2))
- **data-import, libs:** create migration to add manually_created column to mat017-item entity (ICALC-628) ([#559](https://github.com/igusdev/icalc/issues/559)) ([1e60856](https://github.com/igusdev/icalc/commit/1e6085697b766dc267061d87d34f53053cf07a4a))
- integrate iERP service and automate data import (ICALC-127, [#569](https://github.com/igusdev/icalc/issues/569)) ([50e767d](https://github.com/igusdev/icalc/commit/50e767d5d27a0960055414efd148c4f8feeabac0))

### Bug Fixes

- **libs:** add jwt expiration times and bump version v2.3.2 (ICALC-637) ([#575](https://github.com/igusdev/icalc/issues/575)) ([41b6ee7](https://github.com/igusdev/icalc/commit/41b6ee746f8f06f9b2f8c7b9225fae9ba4831e03))

### Reverts

- Revert "v2.3.4" ([c35ba61](https://github.com/igusdev/icalc/commit/c35ba61a906077b66ca04972b5da5aed8ebeb897))
- Revert "v2.4.0" ([5050c62](https://github.com/igusdev/icalc/commit/5050c6229068272c42af40711c60514233d31edf))

## [2.3.2](https://github.com/igusdev/icalc/compare/v2.3.1...v2.3.2) (2024-05-31)

**Note:** Version bump only for package @igus/icalc-entities

## [2.3.0](https://github.com/igusdev/icalc/compare/v2.2.0...v2.3.0) (2024-05-06)

### Features

- introduce business handling for updating mat017Items (ICALC-469) ([#515](https://github.com/igusdev/icalc/issues/515)) ([1538248](https://github.com/igusdev/icalc/commit/15382482ed15f1478a0c777d9676010c21f802aa))

## [2.1.0](https://github.com/igusdev/icalc/compare/v2.0.0...v2.1.0) (2023-12-13)

### Features

- add work step sets (ICALC-456, ICALC-532, ICALC-466) ([#472](https://github.com/igusdev/icalc/issues/472)) ([22860e4](https://github.com/igusdev/icalc/commit/22860e401d5860ee4d7198bb9845c0edbabc4c2e))

## [2.0.0](https://github.com/igusdev/icalc/compare/v1.16.0...v2.0.0) (2023-11-27)

### Bug Fixes

- **data-service, data-import:** query correctly all SCCs related to a snapshot (ICALC-528) ([#467](https://github.com/igusdev/icalc/issues/467)) ([f0d9e0d](https://github.com/igusdev/icalc/commit/f0d9e0d1574f5e4d4df894cfb3f98f4f85051939))

## [1.16.0](https://github.com/igusdev/icalc/compare/v1.15.0...v1.16.0) (2023-10-30)

### Features

- **data-import,data-service,libs:** provide data for new worksteps (ICALC-408) ([#421](https://github.com/igusdev/icalc/issues/421)) ([1fa272e](https://github.com/igusdev/icalc/commit/1fa272e8b23fc374be474c4f830c29ee8680dbf3))
- introduce risk factors (ICALC-443, ICALC-463, [#426](https://github.com/igusdev/icalc/issues/426)) ([7043811](https://github.com/igusdev/icalc/commit/7043811e8959585cf1bd16ddc8f5831c90570e25))

## [1.14.0](https://github.com/igusdev/icalc/compare/v1.13.0...v1.14.0) (2023-08-10)

### Features

- allow only one snapshot of given config within a calculation (ICALC-362) ([#372](https://github.com/igusdev/icalc/issues/372)) ([e23d8e6](https://github.com/igusdev/icalc/commit/e23d8e6a7c4f2253097031b50430551c712bc096))
- track and show who worked on calcs configs (ICALC-246, [#364](https://github.com/igusdev/icalc/issues/364)) ([9d3d8ea](https://github.com/igusdev/icalc/commit/9d3d8ea7d38d6c90d5261baceeb9f55e20445286))

## [1.13.0](https://github.com/igusdev/icalc/compare/v1.12.0...v1.13.0) (2023-07-03)

### Features

- upgrade to kopla 11 and nx16 [ICALC-366] ([#359](https://github.com/igusdev/icalc/issues/359)) ([4504392](https://github.com/igusdev/icalc/commit/45043926a9a3d88dae375084de521ece21809b9e))

# [1.12.0](https://github.com/igusdev/icalc/compare/v1.11.0...v1.12.0) (2023-06-13)

**Note:** Version bump only for package @igus/icalc-entities

# [1.11.0](https://github.com/igusdev/icalc/compare/v1.10.0...v1.11.0) (2023-05-16)

### Features

- :sparkles: show cf diameter in production plan with a symbol ([#338](https://github.com/igusdev/icalc/issues/338)) ([ef22d6f](https://github.com/igusdev/icalc/commit/ef22d6f1601363c6e1aeda6c0570bc179f352495))

# [1.10.0](https://github.com/igusdev/icalc/compare/v1.9.0...v1.10.0) (2023-05-10)

### Bug Fixes

- **icalc-342, icalc-346:** fix workstepOverrides inconsistencies ([#332](https://github.com/igusdev/icalc/issues/332)) ([903aebb](https://github.com/igusdev/icalc/commit/903aebbd43a777e69310765ea734dce384dfb367))

# [1.9.0](https://github.com/igusdev/icalc/compare/v1.8.0...v1.9.0) (2023-04-27)

### Bug Fixes

- **db:** change cf-length and batch size to decimal ([#320](https://github.com/igusdev/icalc/issues/320)) ([178aa23](https://github.com/igusdev/icalc/commit/178aa23bd8391ae41527ddd2ea2476f1f419ef70))

### Features

- icalc 257/individual calc factor ([#304](https://github.com/igusdev/icalc/issues/304)) ([25cc94a](https://github.com/igusdev/icalc/commit/25cc94a18123680ea00632b4899c35e7db1e335b))
- **icalc-228:** introduce backend for locking of calculations ([#310](https://github.com/igusdev/icalc/issues/310)) ([d54575d](https://github.com/igusdev/icalc/commit/d54575da1ed53f51369ff3a96a24cd71989398e4))
- **icalc-304:** extend configuration with snapshots relation ([#315](https://github.com/igusdev/icalc/issues/315)) ([2b9a0d8](https://github.com/igusdev/icalc/commit/2b9a0d8ff9ecd37f43572ce6a058be551f5be080))

# [1.8.0](https://github.com/igusdev/icalc/compare/v1.7.0...v1.8.0) (2023-04-03)

### Features

- icalc 273/cli for db seeding ([#287](https://github.com/igusdev/icalc/issues/287)) ([f2925b0](https://github.com/igusdev/icalc/commit/f2925b093790add78526dfc071e09e1698336677))
- **icalc-240:** calculations and configurations ([#290](https://github.com/igusdev/icalc/issues/290)) ([78db8bc](https://github.com/igusdev/icalc/commit/78db8bcd297cc5abfb2dfbec5220cf531e853b56))
