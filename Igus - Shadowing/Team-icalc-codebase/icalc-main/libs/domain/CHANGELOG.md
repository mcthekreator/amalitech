# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.8.0](https://github.com/igusdev/icalc/compare/v2.7.1...v2.8.0) (2024-09-11)

### Features

- **calculator, libs:** show correct chainflex number of cores and nominal cross section in excel (ICALC-767) ([#667](https://github.com/igusdev/icalc/issues/667)) ([260e76b](https://github.com/igusdev/icalc/commit/260e76b61048ae88911ef484eea60002f3c115c9))

## [2.7.0](https://github.com/igusdev/icalc/compare/v2.6.0...v2.7.0) (2024-08-15)

### Features

- add configuration description to create a copy of configuration dialogues (ICALC-698) ([#626](https://github.com/igusdev/icalc/issues/626)) ([193023f](https://github.com/igusdev/icalc/commit/193023fdd77aa4c645e075fd2f9e25a8de221c31))
- add quote number and customer to meta data and dialogues (ICALC-711) ([#643](https://github.com/igusdev/icalc/issues/643)) ([5c32a2c](https://github.com/igusdev/icalc/commit/5c32a2c6f76766c51b52df2c05708474ff550594))
- **calculator, data-service:** replace matplan download button with select input(ICALC-706) ([#638](https://github.com/igusdev/icalc/issues/638)) ([aa21b07](https://github.com/igusdev/icalc/commit/aa21b07a74603ed3ea2718fa04debf2e08445750))
- **calculator, libs, calculator-e2e:** show configuration description on result page (ICALC-676) ([#635](https://github.com/igusdev/icalc/issues/635)) ([343a58d](https://github.com/igusdev/icalc/commit/343a58dc6b51c75f46d0c9672e5247144a8cbea9))
- **calculator, libs:** replace labeling fields with configuration description in calculation excel export (ICALC-677) ([#636](https://github.com/igusdev/icalc/issues/636)) ([abab792](https://github.com/igusdev/icalc/commit/abab7929711fa44875bad95ffd2ff0905f7e56bc))
- **data-import, libs:** add quote number and customer field to calculation entity (ICALC-712) ([#637](https://github.com/igusdev/icalc/issues/637)) ([d486b7f](https://github.com/igusdev/icalc/commit/d486b7f6560dcabf33a3d43942d32ba23de89ed6))
- show more mat017 item data for pin assignment (ICALC-286) ([#649](https://github.com/igusdev/icalc/issues/649)) ([5f6794c](https://github.com/igusdev/icalc/commit/5f6794c6772ee3d3ac67b3fe045f262593cba41c))

### Bug Fixes

- **calculator, libs:** correct configuration description bugs in iCalc (ICALC-741) ([#647](https://github.com/igusdev/icalc/issues/647)) ([7dc6cca](https://github.com/igusdev/icalc/commit/7dc6cca919a08fe7621853726b98f329a361e295))

## [2.6.0](https://github.com/igusdev/icalc/compare/v2.5.0...v2.6.0) (2024-07-17)

### Features

- **calculator, libs:** download mat-plan in .xls by default (ICALC-683) ([#623](https://github.com/igusdev/icalc/issues/623)) ([e063bf6](https://github.com/igusdev/icalc/commit/e063bf68faad630f9d9928ee728c00f6b2dd4f57))
- include configuration description field in meta data form [disabled by "feature flag"] (ICALC-675) ([#620](https://github.com/igusdev/icalc/issues/620)) ([f704560](https://github.com/igusdev/icalc/commit/f704560fa003ad4f147eebf78d9e6800dfeec1c2))

## [2.5.0](https://github.com/igusdev/icalc/compare/v2.4.2...v2.5.0) (2024-07-02)

**Note:** Version bump only for package @igus/icalc-domain

## [2.4.3](https://github.com/igusdev/icalc/compare/v2.4.2...v2.4.3) (2024-06-24)

### Bug Fixes

- update price of current factory cf object ([1ba37a9](https://github.com/igusdev/icalc/commit/1ba37a91f53d4679315df5287ca7f3e492b83af0))

## [2.4.0](https://github.com/igusdev/icalc/compare/v2.3.0...v2.4.0) (2024-06-13)

### Features

- allow deletion of manually created item from results table on connector steps (ICALC-627) ([#571](https://github.com/igusdev/icalc/issues/571)) ([930954a](https://github.com/igusdev/icalc/commit/930954abbe216a84c49ede8c9da458e41522bc93))
- add filter for manually created Mat017 items (ICALC-625) ([#560](https://github.com/igusdev/icalc/issues/560)) ([02400e4](https://github.com/igusdev/icalc/commit/02400e4fa90ac9b6c51dc6dee565fb730bf35f9f))
- **calculator:** apply remove tabs and space logic to dialogs (ICALC-661) ([#595](https://github.com/igusdev/icalc/issues/595)) ([112cc8d](https://github.com/igusdev/icalc/commit/112cc8d04f2fe9d45588911b14e1757bd2783212))
- **data-import, libs:** create migration to add manually_created column to mat017-item entity (ICALC-628) ([#559](https://github.com/igusdev/icalc/issues/559)) ([1e60856](https://github.com/igusdev/icalc/commit/1e6085697b766dc267061d87d34f53053cf07a4a))
- **data-service, libs:** merge iERP data import with manually created mat017 items (ICALC-626) ([#573](https://github.com/igusdev/icalc/issues/573)) ([723b9d1](https://github.com/igusdev/icalc/commit/723b9d1cea2f63dc7a49fc25edef0bf512a7bf2b))
- integrate iERP service and automate data import (ICALC-127, [#569](https://github.com/igusdev/icalc/issues/569)) ([50e767d](https://github.com/igusdev/icalc/commit/50e767d5d27a0960055414efd148c4f8feeabac0))
- introduce manual creation of mat017 items (ICALC-617) ([#597](https://github.com/igusdev/icalc/issues/597)) ([014cdc7](https://github.com/igusdev/icalc/commit/014cdc7ecaaaf5fe5eb093fca2c3886024b12778))
- **libs:** add function for removal of spaces and tabs in strings (ICALC-659) ([#592](https://github.com/igusdev/icalc/issues/592)) ([6141135](https://github.com/igusdev/icalc/commit/6141135c7951ae1f187b8cf43c36ad9b8da11221))

### Bug Fixes

- **calculator:** only show items in price update modal that are active or inactive and have a price change (ICALC-653) ([#591](https://github.com/igusdev/icalc/issues/591)) ([881dcb5](https://github.com/igusdev/icalc/commit/881dcb50f720ea90d2b8715bce1465011cd19a88))
- **data-service, libs:** solve akeneo bad request error and investigate akeneo api change (ICALC-564, [#570](https://github.com/igusdev/icalc/issues/570)) ([79b4545](https://github.com/igusdev/icalc/commit/79b4545dd8c3bb02122288bd8c4fb68c37413c09))
- **libs:** add jwt expiration times and bump version v2.3.2 (ICALC-637) ([#575](https://github.com/igusdev/icalc/issues/575)) ([41b6ee7](https://github.com/igusdev/icalc/commit/41b6ee746f8f06f9b2f8c7b9225fae9ba4831e03))

### Reverts

- Revert "v2.3.4" ([c35ba61](https://github.com/igusdev/icalc/commit/c35ba61a906077b66ca04972b5da5aed8ebeb897))
- Revert "v2.4.0" ([5050c62](https://github.com/igusdev/icalc/commit/5050c6229068272c42af40711c60514233d31edf))

## [2.3.2](https://github.com/igusdev/icalc/compare/v2.3.1...v2.3.2) (2024-05-31)

**Note:** Version bump only for package @igus/icalc-domain

## [2.3.1](https://github.com/igusdev/icalc/compare/v2.3.0...v2.3.1) (2024-05-14)

**Note:** Version bump only for package @igus/icalc-domain

## [2.3.0](https://github.com/igusdev/icalc/compare/v2.2.0...v2.3.0) (2024-05-06)

### Features

- **data-import, libs:** add new mat017 item & usage data from AX (ICALC-562, [#517](https://github.com/igusdev/icalc/issues/517)) ([b813f19](https://github.com/igusdev/icalc/commit/b813f195c3f19be76d9854a51f02af424d316397))
- introduce business handling for updating mat017Items (ICALC-469) ([#515](https://github.com/igusdev/icalc/issues/515)) ([1538248](https://github.com/igusdev/icalc/commit/15382482ed15f1478a0c777d9676010c21f802aa))

### Bug Fixes

- **calculator, calculator-e2e:** enhance pin assignments of MAT017 items (ICALC-474, ICALC-559) ([#494](https://github.com/igusdev/icalc/issues/494)) ([754327b](https://github.com/igusdev/icalc/commit/754327b0029c62dfb9485b08fdc06185509f083d))
- **calculator, libs:** bug fixes for mat017 item update (ICALC-595) ([#536](https://github.com/igusdev/icalc/issues/536)) ([ef85d97](https://github.com/igusdev/icalc/commit/ef85d97266fc3353fca30a22477460cb369fa884))
- main bug fixes branch for icalc 469 (ICALC-595) ([#539](https://github.com/igusdev/icalc/issues/539)) ([ceb6c05](https://github.com/igusdev/icalc/commit/ceb6c058d289681e58ee991563a503b01579ef66))

## [2.2.0](https://github.com/igusdev/icalc/compare/v2.1.0...v2.2.0) (2024-01-16)

### Features

- **calculator, libs, calculator-e2e:** adjust saveSingleCableCalculation endpoint (ICALC-514) ([#461](https://github.com/igusdev/icalc/issues/461)) ([e15d7ed](https://github.com/igusdev/icalc/commit/e15d7edadf366c47941ba29c47a91c725b9c37ea))

## [2.1.0](https://github.com/igusdev/icalc/compare/v2.0.0...v2.1.0) (2023-12-13)

### Features

- add work step sets (ICALC-456, ICALC-532, ICALC-466) ([#472](https://github.com/igusdev/icalc/issues/472)) ([22860e4](https://github.com/igusdev/icalc/commit/22860e401d5860ee4d7198bb9845c0edbabc4c2e))

### Bug Fixes

- **calculator:** unnecessary update of calculation modification date (ICALC-468) ([#462](https://github.com/igusdev/icalc/issues/462)) ([3b50f60](https://github.com/igusdev/icalc/commit/3b50f6076f7ec7de217d0d14bb9f52d7621933cc))
- **libs:** prevent runtime error in process.service (ICALC-534, [#475](https://github.com/igusdev/icalc/issues/475)) ([8936042](https://github.com/igusdev/icalc/commit/89360424d9c24adec36ea33072322feead5668cc))

## [2.0.0](https://github.com/igusdev/icalc/compare/v1.16.0...v2.0.0) (2023-11-27)

**Note:** Version bump only for package @igus/icalc-domain

## [1.16.0](https://github.com/igusdev/icalc/compare/v1.15.0...v1.16.0) (2023-10-30)

### Features

- **data-import,data-service,libs:** provide data for new worksteps (ICALC-408) ([#421](https://github.com/igusdev/icalc/issues/421)) ([1fa272e](https://github.com/igusdev/icalc/commit/1fa272e8b23fc374be474c4f830c29ee8680dbf3))
- introduce risk factors (ICALC-443, ICALC-463, [#426](https://github.com/igusdev/icalc/issues/426)) ([7043811](https://github.com/igusdev/icalc/commit/7043811e8959585cf1bd16ddc8f5831c90570e25))

## [1.15.0](https://github.com/igusdev/icalc/compare/v1.14.0...v1.15.0) (2023-10-10)

### Features

- create switch option for switching through work steps (ICALC-455) ([#407](https://github.com/igusdev/icalc/issues/407)) ([44bbc6c](https://github.com/igusdev/icalc/commit/44bbc6c953a4b61c3850b983668c62dc754065b9))
- introduce handling of updated or removed chainflex prices (ICALC-387, [#415](https://github.com/igusdev/icalc/issues/415)) ([f82d590](https://github.com/igusdev/icalc/commit/f82d590d07975e0ae0ba120c5a7d1fc6d1789d27))
- move 'select connector sets' button to footer (ICALC-430, [#400](https://github.com/igusdev/icalc/issues/400)) ([20844ff](https://github.com/igusdev/icalc/commit/20844ff9239b9250431c45535045b680518a65c2))

## [1.14.0](https://github.com/igusdev/icalc/compare/v1.13.0...v1.14.0) (2023-08-10)

### Features

- remove assignments between calcs and confs (ICALC-255, [#382](https://github.com/igusdev/icalc/issues/382)) ([83de54b](https://github.com/igusdev/icalc/commit/83de54bfb620558d7685d2fa1867de79156af831))
- track and show who worked on calcs configs (ICALC-246, [#364](https://github.com/igusdev/icalc/issues/364)) ([9d3d8ea](https://github.com/igusdev/icalc/commit/9d3d8ea7d38d6c90d5261baceeb9f55e20445286))

### Bug Fixes

- ensure approval is not revoked and pin assignment image is saved correctly (ICALC-330, ICALC-454) ([#394](https://github.com/igusdev/icalc/issues/394)) ([631a02b](https://github.com/igusdev/icalc/commit/631a02b22fb8fa28ad8b0b4121503d2ecb7669df))
- show roll up input on pin assignment image, rename pin assignment headlines (ICALC-417, ICALC-421, [#378](https://github.com/igusdev/icalc/issues/378)) ([6b9edc2](https://github.com/igusdev/icalc/commit/6b9edc2e78478d57399ea5f310ee0591333e2ef9))

## [1.13.0](https://github.com/igusdev/icalc/compare/v1.12.0...v1.13.0) (2023-07-03)

### Features

- upgrade to kopla 11 and nx16 [ICALC-366] ([#359](https://github.com/igusdev/icalc/issues/359)) ([4504392](https://github.com/igusdev/icalc/commit/45043926a9a3d88dae375084de521ece21809b9e))

### Bug Fixes

- remove 'twisting' items from iterated array for generated forms (ICALC-419, [#376](https://github.com/igusdev/icalc/issues/376)) ([9908483](https://github.com/igusdev/icalc/commit/9908483ce559edeafb324d0736bde6219269a6a4))

# [1.12.0](https://github.com/igusdev/icalc/compare/v1.11.0...v1.12.0) (2023-06-13)

### Bug Fixes

- **calculator:** fix sketch issues with snapshots (icalc-340) ([#350](https://github.com/igusdev/icalc/issues/350)) ([c031ac9](https://github.com/igusdev/icalc/commit/c031ac9620eea78c4b8b319aca02994e4af100a9))

### Features

- (ICALC-307) tests for locking calculations ([#340](https://github.com/igusdev/icalc/issues/340)) ([0ae9923](https://github.com/igusdev/icalc/commit/0ae9923b481b9d4cf9928ff71124c5e619eaeaca))

# [1.11.0](https://github.com/igusdev/icalc/compare/v1.10.0...v1.11.0) (2023-05-16)

### Bug Fixes

- **ICALC-287:** enforce order of configurations from oldest to latest ([#341](https://github.com/igusdev/icalc/issues/341)) ([2fbcc1b](https://github.com/igusdev/icalc/commit/2fbcc1bf301df5368f7ad6291800039b86c5b9af))

### Features

- :sparkles: show cf diameter in production plan with a symbol ([#338](https://github.com/igusdev/icalc/issues/338)) ([ef22d6f](https://github.com/igusdev/icalc/commit/ef22d6f1601363c6e1aeda6c0570bc179f352495))

# [1.10.0](https://github.com/igusdev/icalc/compare/v1.9.0...v1.10.0) (2023-05-10)

### Bug Fixes

- **icalc-342, icalc-346:** fix workstepOverrides inconsistencies ([#332](https://github.com/igusdev/icalc/issues/332)) ([903aebb](https://github.com/igusdev/icalc/commit/903aebbd43a777e69310765ea734dce384dfb367))

# [1.9.0](https://github.com/igusdev/icalc/compare/v1.8.0...v1.9.0) (2023-04-27)

### Bug Fixes

- icalc 334/rounding difference between icalc and excel ([#323](https://github.com/igusdev/icalc/issues/323)) ([451a8d5](https://github.com/igusdev/icalc/commit/451a8d5c9d1c2bd9b553ac76226f10800ed0b692))

### Features

- icalc 257/individual calc factor ([#304](https://github.com/igusdev/icalc/issues/304)) ([25cc94a](https://github.com/igusdev/icalc/commit/25cc94a18123680ea00632b4899c35e7db1e335b))
- icalc 299/assign existing configuration ([#324](https://github.com/igusdev/icalc/issues/324)) ([66a68ad](https://github.com/igusdev/icalc/commit/66a68ad1474bdadcc549b4a07d0620243ea26950))
- icalc 327/response dtos and mapper ([#317](https://github.com/igusdev/icalc/issues/317)) ([5bdeff7](https://github.com/igusdev/icalc/commit/5bdeff77f139d0a9e4b84d8f979f39bf7d1a17c1))
- **icalc-228:** introduce backend for locking of calculations ([#310](https://github.com/igusdev/icalc/issues/310)) ([d54575d](https://github.com/igusdev/icalc/commit/d54575da1ed53f51369ff3a96a24cd71989398e4))
- **icalc-251:** handle locked calculations in frontend ([#322](https://github.com/igusdev/icalc/issues/322)) ([f0d981b](https://github.com/igusdev/icalc/commit/f0d981b1d80b8f4791543e32be5084286f274bd6))
- **icalc-304:** extend configuration with snapshots relation ([#315](https://github.com/igusdev/icalc/issues/315)) ([2b9a0d8](https://github.com/igusdev/icalc/commit/2b9a0d8ff9ecd37f43572ce6a058be551f5be080))

# [1.8.0](https://github.com/igusdev/icalc/compare/v1.7.0...v1.8.0) (2023-04-03)

### Features

- icalc 248/commercial rounding ([#294](https://github.com/igusdev/icalc/issues/294)) ([cf8d4c6](https://github.com/igusdev/icalc/commit/cf8d4c624314c748937eaa03bc947c5feaa6661b))
- icalc 273/cli for db seeding ([#287](https://github.com/igusdev/icalc/issues/287)) ([f2925b0](https://github.com/igusdev/icalc/commit/f2925b093790add78526dfc071e09e1698336677))
- **icalc-240:** calculations and configurations ([#290](https://github.com/igusdev/icalc/issues/290)) ([78db8bc](https://github.com/igusdev/icalc/commit/78db8bcd297cc5abfb2dfbec5220cf531e853b56))

# [1.6.0](https://github.com/igusdev/icalc/compare/v1.5.0...v1.6.0) (2023-02-28)

### Bug Fixes

- add missing color codes, add refactoring suggestion ([d7cab58](https://github.com/igusdev/icalc/commit/d7cab58aab60c1fb1c46085ada634e47663ea088))

### Features

- icalc 242/incomplete configurations ([#260](https://github.com/igusdev/icalc/issues/260)) ([94556ba](https://github.com/igusdev/icalc/commit/94556ba292560f963369165c782cc4adc44ebaf5))
- icalc 245/various fixes ([#264](https://github.com/igusdev/icalc/issues/264)) ([58c36c9](https://github.com/igusdev/icalc/commit/58c36c95e6688bdc5a3b8446c96c64c46e95608c))

# [1.5.0](https://github.com/igusdev/icalc/compare/v1.4.0...v1.5.0) (2023-02-03)

**Note:** Version bump only for package @igus/icalc-domain

# [1.4.0](https://github.com/igusdev/icalc/compare/v1.3.0...v1.4.0) (2022-12-20)

**Note:** Version bump only for package @igus/icalc-domain

# [1.3.0](https://github.com/igusdev/icalc/compare/v1.2.0...v1.3.0) (2022-12-12)

**Note:** Version bump only for package @igus/icalc-domain

# [1.2.0](https://github.com/igusdev/icalc/compare/v1.1.0...v1.2.0) (2022-11-25)

**Note:** Version bump only for package @igus/icalc-domain

# [1.1.0](https://github.com/igusdev/icalc/compare/v1.0.0...v1.1.0) (2022-11-16)

**Note:** Version bump only for package @igus/icalc-domain

# [1.0.0](https://github.com/igusdev/icalc/compare/v0.13.4...v1.0.0) (2022-11-02)

**Note:** Version bump only for package @igus/icalc-domain

## [0.13.3](https://github.com/igusdev/icalc/compare/v0.13.2...v0.13.3) (2022-11-01)

**Note:** Version bump only for package @igus/icalc-domain

## [0.13.2](https://github.com/igusdev/icalc/compare/v0.13.0...v0.13.2) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-domain

## [0.13.1](https://github.com/igusdev/icalc/compare/v0.13.0...v0.13.1) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-domain

# [0.13.0](https://github.com/igusdev/icalc/compare/v0.12.10...v0.13.0) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-domain

## [0.12.10](https://github.com/igusdev/icalc/compare/v0.12.9...v0.12.10) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-domain

## [0.12.9](https://github.com/igusdev/icalc/compare/v0.12.8...v0.12.9) (2022-10-26)

**Note:** Version bump only for package @igus/icalc-domain

## [0.12.8](https://github.com/igusdev/icalc/compare/v0.9.0...v0.12.8) (2022-10-25)

### Features

- icalc 141/data adjustments ([#184](https://github.com/igusdev/icalc/issues/184)) ([dd7908b](https://github.com/igusdev/icalc/commit/dd7908ba7f7f103ce42ce5cd801138431a8e5173))

### Reverts

- change postgres db hostnames back to previous ([cd91dbe](https://github.com/igusdev/icalc/commit/cd91dbe8adf04e966fe00cac0802825699264e61))

# [0.9.0](https://github.com/igusdev/icalc/compare/v0.8.0...v0.9.0) (2022-10-14)

### Bug Fixes

- :bug: reset the calculation when loading a saved mat904 ([#174](https://github.com/igusdev/icalc/issues/174)) ([1760216](https://github.com/igusdev/icalc/commit/17602165e92b9077b1084cc0f4410f5d3b904f5d))

### Features

- fix for the type problem on calculation ([6e5b199](https://github.com/igusdev/icalc/commit/6e5b199ae6344239b8902a58bf15268b8c84454e))
- icalc 113 / pin assignment (previously: line configuration) ([#171](https://github.com/igusdev/icalc/issues/171)) ([d4cf123](https://github.com/igusdev/icalc/commit/d4cf12330692f518dcb6a2565cea3e73147c139c))
- icalc 46/ Favorites (prefill configurations) ([#173](https://github.com/igusdev/icalc/issues/173)) ([28af0d1](https://github.com/igusdev/icalc/commit/28af0d114f09ffb6a752d9876666a6d1bd4136d3))

# [0.8.0](https://github.com/igusdev/icalc/compare/v0.7.0...v0.8.0) (2022-09-22)

### Features

- icalc 113/line configurator poc ([#162](https://github.com/igusdev/icalc/issues/162)) ([0e185e0](https://github.com/igusdev/icalc/commit/0e185e0a0365269a94637e4a6ff43bc4fde5875b))

# [0.7.0](https://github.com/igusdev/icalc/compare/v0.6.0...v0.7.0) (2022-08-24)

**Note:** Version bump only for package @igus/icalc-domain

# [0.6.0](https://github.com/igusdev/icalc/compare/v0.5.0...v0.6.0) (2022-08-23)

### Features

- :sparkles: add factored total price to calc result, display on … ([#144](https://github.com/igusdev/icalc/issues/144)) ([c0343c7](https://github.com/igusdev/icalc/commit/c0343c7d7591408a5da5827245cfba829069565d))
- calculation of unit amout ([#143](https://github.com/igusdev/icalc/issues/143)) ([588f059](https://github.com/igusdev/icalc/commit/588f059f10f39f6dca600e8b20ebb213b4be31ef))
- icalc 27/calculation step ([#132](https://github.com/igusdev/icalc/issues/132)) ([601e912](https://github.com/igusdev/icalc/commit/601e9125b6376892f90f4b0dad516f196e662519))

# [0.5.0](https://github.com/igusdev/icalc/compare/v0.4.0...v0.5.0) (2022-08-01)

**Note:** Version bump only for package @igus/icalc-domain

# [0.4.0](https://github.com/igusdev/icalc/compare/v0.3.0...v0.4.0) (2022-08-01)

**Note:** Version bump only for package @igus/icalc-domain

# [0.3.0](https://github.com/igusdev/icalc/compare/v0.2.5...v0.3.0) (2022-07-29)

**Note:** Version bump only for package @igus/icalc-domain

## [0.2.5](https://github.com/igusdev/icalc/compare/v0.2.4...v0.2.5) (2022-07-29)

**Note:** Version bump only for package @igus/icalc-domain

# [0.2.0](https://github.com/igusdev/icalc/compare/v0.1.0...v0.2.0) (2022-07-22)

### Bug Fixes

- **data-service:** resolve startup issues ([#114](https://github.com/igusdev/icalc/issues/114)) ([81cfea6](https://github.com/igusdev/icalc/commit/81cfea6a13f176a2a28d83145147270d193041a5))
- eslint rule ([c228708](https://github.com/igusdev/icalc/commit/c2287088e7372a8f881509f6fa36012ee54e5f35))

### Features

- :sparkles: add postgres staging environment variables ([#120](https://github.com/igusdev/icalc/issues/120)) ([b18df5c](https://github.com/igusdev/icalc/commit/b18df5c35b527182ea64eea4ab457f6d8097adaf))
- csv files which hold the data from AX are used by postgres [ICALC-96] ([76942b4](https://github.com/igusdev/icalc/commit/76942b4e5511b7b667a4756e3d14a946f633d946))
- first serverside excel download finished ([ef1a336](https://github.com/igusdev/icalc/commit/ef1a336c75aa2440b928fd19d239588f2534fa5c))
- icalc 67/adjust chainflex backend ([#115](https://github.com/igusdev/icalc/issues/115)) ([f70b0b3](https://github.com/igusdev/icalc/commit/f70b0b3ca04362d88fdf45329bdb4585faf704b0))
- icalc 80/show data ([#105](https://github.com/igusdev/icalc/issues/105)) ([620a59e](https://github.com/igusdev/icalc/commit/620a59ead76eea249137051bedfd563a3a3efa81))
- icalc 81/show connector data ([#111](https://github.com/igusdev/icalc/issues/111)) ([f1a771a](https://github.com/igusdev/icalc/commit/f1a771a3283c5817e55affd11f937022a9347dbe))
- nx migration done ([#52](https://github.com/igusdev/icalc/issues/52)) ([e1dd038](https://github.com/igusdev/icalc/commit/e1dd0385bda23a94bb1112de59fa039977e6a3ba))
- testing errors fixed ([f1446cb](https://github.com/igusdev/icalc/commit/f1446cb37d8332487502398f707b40790c1a3969))

# [0.1.0](https://github.com/igusdev/icalc/compare/v0.0.4...v0.1.0) (2022-03-16)

**Note:** Version bump only for package @igus/icalc-domain

## [0.0.4](https://github.com/igusdev/icalc/compare/v0.0.2...v0.0.4) (2022-03-16)

**Note:** Version bump only for package @igus/icalc-domain

**Note:** Version bump only for package @igus/icalc-domain

## 0.0.2 (2022-03-14)

### Bug Fixes

- adjust configs ([#2](https://github.com/igusdev/icalc/issues/2)) ([8302fe8](https://github.com/igusdev/icalc/commit/8302fe856a01541873dc9b7dcf53651d3021936a))
- remove last gears references ([0d0a0f6](https://github.com/igusdev/icalc/commit/0d0a0f619faf37c443277343de6ecc251f61cbc8))
