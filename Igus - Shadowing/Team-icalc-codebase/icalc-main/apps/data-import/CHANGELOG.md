# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.7.0](https://github.com/igusdev/icalc/compare/v2.6.0...v2.7.0) (2024-08-15)

### Features

- **data-import, libs:** add quote number and customer field to calculation entity (ICALC-712) ([#637](https://github.com/igusdev/icalc/issues/637)) ([d486b7f](https://github.com/igusdev/icalc/commit/d486b7f6560dcabf33a3d43942d32ba23de89ed6))

## [2.6.0](https://github.com/igusdev/icalc/compare/v2.5.0...v2.6.0) (2024-07-17)

**Note:** Version bump only for package @igus/icalc-data-import

## [2.5.0](https://github.com/igusdev/icalc/compare/v2.4.2...v2.5.0) (2024-07-02)

**Note:** Version bump only for package @igus/icalc-data-import

## [2.4.3](https://github.com/igusdev/icalc/compare/v2.4.2...v2.4.3) (2024-06-24)

**Note:** Version bump only for package @igus/icalc-data-import

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

**Note:** Version bump only for package @igus/icalc-data-import

## [2.3.1](https://github.com/igusdev/icalc/compare/v2.3.0...v2.3.1) (2024-05-14)

**Note:** Version bump only for package @igus/icalc-data-import

## [2.3.0](https://github.com/igusdev/icalc/compare/v2.2.0...v2.3.0) (2024-05-06)

### Features

- **data-import, libs:** add new mat017 item & usage data from AX (ICALC-562, [#517](https://github.com/igusdev/icalc/issues/517)) ([b813f19](https://github.com/igusdev/icalc/commit/b813f195c3f19be76d9854a51f02af424d316397))
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

## [1.15.0](https://github.com/igusdev/icalc/compare/v1.14.0...v1.15.0) (2023-10-10)

### Features

- introduce handling of updated or removed chainflex prices (ICALC-387, [#415](https://github.com/igusdev/icalc/issues/415)) ([f82d590](https://github.com/igusdev/icalc/commit/f82d590d07975e0ae0ba120c5a7d1fc6d1789d27))
- make specific user account unusable (ICALC-442, [#399](https://github.com/igusdev/icalc/issues/399)) ([16812d6](https://github.com/igusdev/icalc/commit/16812d69bb19de9d284902cef3e8fbcf1bf9974a))

## [1.14.0](https://github.com/igusdev/icalc/compare/v1.13.0...v1.14.0) (2023-08-10)

### Features

- allow only one snapshot of given config within a calculation (ICALC-362) ([#372](https://github.com/igusdev/icalc/issues/372)) ([e23d8e6](https://github.com/igusdev/icalc/commit/e23d8e6a7c4f2253097031b50430551c712bc096))
- **ci:** create db snapshot in pipeline (ICALC-386, [#381](https://github.com/igusdev/icalc/issues/381)) ([#381](https://github.com/igusdev/icalc/issues/381)) ([7b6f66d](https://github.com/igusdev/icalc/commit/7b6f66da5f70898e0ff0de64c43a4cee404a41f8))
- **ci:** wait until new db snapshot... (ICALC-386) ([#392](https://github.com/igusdev/icalc/issues/392)) ([cc861be](https://github.com/igusdev/icalc/commit/cc861be26422ade2336b1f7a583153dea65797c8))
- track and show who worked on calcs configs (ICALC-246, [#364](https://github.com/igusdev/icalc/issues/364)) ([9d3d8ea](https://github.com/igusdev/icalc/commit/9d3d8ea7d38d6c90d5261baceeb9f55e20445286))
- update monorepo nx migrate (ICALC-272, [#397](https://github.com/igusdev/icalc/issues/397)) ([fe7f37d](https://github.com/igusdev/icalc/commit/fe7f37d6118ea54778aa1855438aeeb4271fb51b))

### Bug Fixes

- **data-import:** delete the V36 flyway migration script (ICALC-386) ([#390](https://github.com/igusdev/icalc/issues/390)) ([9c9926b](https://github.com/igusdev/icalc/commit/9c9926bb6ab0c1e21519f971f4847893cba5662f))

## [1.13.0](https://github.com/igusdev/icalc/compare/v1.12.0...v1.13.0) (2023-07-03)

### Features

- upgrade to kopla 11 and nx16 [ICALC-366] ([#359](https://github.com/igusdev/icalc/issues/359)) ([4504392](https://github.com/igusdev/icalc/commit/45043926a9a3d88dae375084de521ece21809b9e))

### Bug Fixes

- **ci:** fix resolve module not found issue [ICALC-366] ([#361](https://github.com/igusdev/icalc/issues/361)) ([79a98a5](https://github.com/igusdev/icalc/commit/79a98a58b2d12f693079bced1b9ca2ceb271d847))

# [1.12.0](https://github.com/igusdev/icalc/compare/v1.11.0...v1.12.0) (2023-06-13)

### Features

- (ICALC-307) tests for locking calculations ([#340](https://github.com/igusdev/icalc/issues/340)) ([0ae9923](https://github.com/igusdev/icalc/commit/0ae9923b481b9d4cf9928ff71124c5e619eaeaca))

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

# [1.6.0](https://github.com/igusdev/icalc/compare/v1.5.0...v1.6.0) (2023-02-28)

### Features

- icalc 242/incomplete configurations ([#260](https://github.com/igusdev/icalc/issues/260)) ([94556ba](https://github.com/igusdev/icalc/commit/94556ba292560f963369165c782cc4adc44ebaf5))

# [1.5.0](https://github.com/igusdev/icalc/compare/v1.4.0...v1.5.0) (2023-02-03)

### Features

- update akeneo endpoint url, ICALC-243 ([#241](https://github.com/igusdev/icalc/issues/241)) ([806d336](https://github.com/igusdev/icalc/commit/806d3366cb70cbddd704b6fdacf8833882a21cec))

# [1.3.0](https://github.com/igusdev/icalc/compare/v1.2.0...v1.3.0) (2022-12-12)

**Note:** Version bump only for package @igus/icalc-data-import

# [1.1.0](https://github.com/igusdev/icalc/compare/v1.0.0...v1.1.0) (2022-11-16)

**Note:** Version bump only for package @igus/icalc-data-import

# [1.0.0](https://github.com/igusdev/icalc/compare/v0.13.4...v1.0.0) (2022-11-02)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.13.3](https://github.com/igusdev/icalc/compare/v0.13.2...v0.13.3) (2022-11-01)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.13.2](https://github.com/igusdev/icalc/compare/v0.13.0...v0.13.2) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.13.1](https://github.com/igusdev/icalc/compare/v0.13.0...v0.13.1) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-data-import

# [0.13.0](https://github.com/igusdev/icalc/compare/v0.12.10...v0.13.0) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.12.10](https://github.com/igusdev/icalc/compare/v0.12.9...v0.12.10) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.12.9](https://github.com/igusdev/icalc/compare/v0.12.8...v0.12.9) (2022-10-26)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.12.8](https://github.com/igusdev/icalc/compare/v0.9.0...v0.12.8) (2022-10-25)

### Features

- cronjob fallback implemented, code refactored ([#183](https://github.com/igusdev/icalc/issues/183)) ([6f3feef](https://github.com/igusdev/icalc/commit/6f3feeffde530ab5abffff7dc7396dc10df69f52))
- icalc 141/data adjustments ([#184](https://github.com/igusdev/icalc/issues/184)) ([dd7908b](https://github.com/igusdev/icalc/commit/dd7908ba7f7f103ce42ce5cd801138431a8e5173))

# [0.9.0](https://github.com/igusdev/icalc/compare/v0.8.0...v0.9.0) (2022-10-14)

### Features

- icalc 113 / pin assignment (previously: line configuration) ([#171](https://github.com/igusdev/icalc/issues/171)) ([d4cf123](https://github.com/igusdev/icalc/commit/d4cf12330692f518dcb6a2565cea3e73147c139c))
- icalc 46/ Favorites (prefill configurations) ([#173](https://github.com/igusdev/icalc/issues/173)) ([28af0d1](https://github.com/igusdev/icalc/commit/28af0d114f09ffb6a752d9876666a6d1bd4136d3))

# [0.8.0](https://github.com/igusdev/icalc/compare/v0.7.0...v0.8.0) (2022-09-22)

### Features

- icalc 128/daily akeneo sync ([#154](https://github.com/igusdev/icalc/issues/154)) ([9f54d6e](https://github.com/igusdev/icalc/commit/9f54d6e57eeb4077c92ca824de4f1a75da468174))
- Index script added ([#149](https://github.com/igusdev/icalc/issues/149)) ([af64496](https://github.com/igusdev/icalc/commit/af644968f7e429173a3cc4dd064eb5134c0c0e48))

# [0.7.0](https://github.com/igusdev/icalc/compare/v0.6.0...v0.7.0) (2022-08-24)

### Features

- :sparkles: add flyway/sql script to insert new chainflex prices to db ([#146](https://github.com/igusdev/icalc/issues/146)) ([ec1d27a](https://github.com/igusdev/icalc/commit/ec1d27ae244a1b9bd49a9d1561e74aed524957a8))

# [0.6.0](https://github.com/igusdev/icalc/compare/v0.5.0...v0.6.0) (2022-08-23)

### Bug Fixes

- remove dead code ([65713dd](https://github.com/igusdev/icalc/commit/65713dd0b667fc2b4c8b529291d37daed363133f))

# [0.5.0](https://github.com/igusdev/icalc/compare/v0.4.0...v0.5.0) (2022-08-01)

**Note:** Version bump only for package @igus/icalc-data-import

# [0.4.0](https://github.com/igusdev/icalc/compare/v0.3.0...v0.4.0) (2022-08-01)

**Note:** Version bump only for package @igus/icalc-data-import

# [0.3.0](https://github.com/igusdev/icalc/compare/v0.2.5...v0.3.0) (2022-07-29)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.2.5](https://github.com/igusdev/icalc/compare/v0.2.4...v0.2.5) (2022-07-29)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.2.4](https://github.com/igusdev/icalc/compare/v0.2.3...v0.2.4) (2022-07-28)

### Bug Fixes

- :art: throw error message in unknown environment ([#123](https://github.com/igusdev/icalc/issues/123)) ([a53a086](https://github.com/igusdev/icalc/commit/a53a086981f43df66d59602878697eedbf3a5255))

## [0.2.3](https://github.com/igusdev/icalc/compare/v0.2.2...v0.2.3) (2022-07-27)

### Bug Fixes

- :bug: fix empty space error ([42a35e9](https://github.com/igusdev/icalc/commit/42a35e955ae9c3165018288cabb81170b0cd4f0c))

## [0.2.2](https://github.com/igusdev/icalc/compare/v0.2.1...v0.2.2) (2022-07-27)

**Note:** Version bump only for package @igus/icalc-data-import

## [0.2.1](https://github.com/igusdev/icalc/compare/v0.2.0...v0.2.1) (2022-07-27)

**Note:** Version bump only for package @igus/icalc-data-import

# [0.2.0](https://github.com/igusdev/icalc/compare/v0.1.0...v0.2.0) (2022-07-22)

### Bug Fixes

- mat017 cvs fıles corrected ([0e5361a](https://github.com/igusdev/icalc/commit/0e5361a20c1296013e966fe4b795070090f61aec))

### Features

- csv files which hold the data from AX are used by postgres [ICALC-96] ([76942b4](https://github.com/igusdev/icalc/commit/76942b4e5511b7b667a4756e3d14a946f633d946))
- icalc 67/adjust chainflex backend ([#115](https://github.com/igusdev/icalc/issues/115)) ([f70b0b3](https://github.com/igusdev/icalc/commit/f70b0b3ca04362d88fdf45329bdb4585faf704b0))
- icalc 80/show data ([#105](https://github.com/igusdev/icalc/issues/105)) ([620a59e](https://github.com/igusdev/icalc/commit/620a59ead76eea249137051bedfd563a3a3efa81))
- icalc 81/show connector data ([#111](https://github.com/igusdev/icalc/issues/111)) ([f1a771a](https://github.com/igusdev/icalc/commit/f1a771a3283c5817e55affd11f937022a9347dbe))
- lint errors fixed for the pipeline ([a644048](https://github.com/igusdev/icalc/commit/a6440484bf8c691e7d3993e05e676534a6be289a))
- testing errors fixed ([f1446cb](https://github.com/igusdev/icalc/commit/f1446cb37d8332487502398f707b40790c1a3969))
- wrong reference fixed ([b7cde38](https://github.com/igusdev/icalc/commit/b7cde38aab326c2f99d0b09a80280f1fca46e866))
