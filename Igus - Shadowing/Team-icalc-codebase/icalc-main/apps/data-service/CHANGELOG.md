# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.8.0](https://github.com/igusdev/icalc/compare/v2.7.1...v2.8.0) (2024-09-11)

### Features

- **libs, data-service:** change mat-plan template (ICALC-766) ([#666](https://github.com/igusdev/icalc/issues/666)) ([677d91a](https://github.com/igusdev/icalc/commit/677d91a5f1d774d849aa3333fc0fe0e1db453abf))

## [2.7.0](https://github.com/igusdev/icalc/compare/v2.6.0...v2.7.0) (2024-08-15)

### Features

- **data-import, libs:** add quote number and customer field to calculation entity (ICALC-712) ([#637](https://github.com/igusdev/icalc/issues/637)) ([d486b7f](https://github.com/igusdev/icalc/commit/d486b7f6560dcabf33a3d43942d32ba23de89ed6))
- **data-service:** adjust chainflex update logic (ICALC-740) ([#651](https://github.com/igusdev/icalc/issues/651)) ([4e5d803](https://github.com/igusdev/icalc/commit/4e5d803d4865733a4889dd111663bf13de1d7d76))

## [2.6.1](https://github.com/igusdev/icalc/compare/v2.6.0...v2.6.1) (2024-07-17)

**Note:** Version bump only for package @igus/icalc-data-service

## [2.6.0](https://github.com/igusdev/icalc/compare/v2.5.0...v2.6.0) (2024-07-17)

### Features

- **calculator, libs:** download mat-plan in .xls by default (ICALC-683) ([#623](https://github.com/igusdev/icalc/issues/623)) ([e063bf6](https://github.com/igusdev/icalc/commit/e063bf68faad630f9d9928ee728c00f6b2dd4f57))

## [2.5.0](https://github.com/igusdev/icalc/compare/v2.4.2...v2.5.0) (2024-07-02)

### Bug Fixes

- add healthcheck to avoid data-service crash in docker dev ([#596](https://github.com/igusdev/icalc/issues/596)) ([7e92452](https://github.com/igusdev/icalc/commit/7e924529f71b57f732accb6a811db3609ee8ed01))

## [2.4.0](https://github.com/igusdev/icalc/compare/v2.3.0...v2.4.0) (2024-06-13)

### Features

- allow deletion of manually created item from results table on connector steps (ICALC-627) ([#571](https://github.com/igusdev/icalc/issues/571)) ([930954a](https://github.com/igusdev/icalc/commit/930954abbe216a84c49ede8c9da458e41522bc93))
- integrate iERP service and automate data import (ICALC-127, [#569](https://github.com/igusdev/icalc/issues/569)) ([50e767d](https://github.com/igusdev/icalc/commit/50e767d5d27a0960055414efd148c4f8feeabac0))

### Bug Fixes

- **data-service, libs:** solve akeneo bad request error and investigate akeneo api change (ICALC-564, [#570](https://github.com/igusdev/icalc/issues/570)) ([79b4545](https://github.com/igusdev/icalc/commit/79b4545dd8c3bb02122288bd8c4fb68c37413c09))
- **data-service:** ignore tests for widen service with File API (ICALC-583) ([#551](https://github.com/igusdev/icalc/issues/551)) ([d01e115](https://github.com/igusdev/icalc/commit/d01e115e880fda4579c3336d1520f15c1c9b9106))
- **libs:** add jwt expiration times and bump version v2.3.2 (ICALC-637) ([#575](https://github.com/igusdev/icalc/issues/575)) ([41b6ee7](https://github.com/igusdev/icalc/commit/41b6ee746f8f06f9b2f8c7b9225fae9ba4831e03))

### Reverts

- Revert "v2.3.4" ([c35ba61](https://github.com/igusdev/icalc/commit/c35ba61a906077b66ca04972b5da5aed8ebeb897))
- Revert "v2.4.0" ([5050c62](https://github.com/igusdev/icalc/commit/5050c6229068272c42af40711c60514233d31edf))

## [2.3.2](https://github.com/igusdev/icalc/compare/v2.3.1...v2.3.2) (2024-05-31)

**Note:** Version bump only for package @igus/icalc-data-service

## [2.3.1](https://github.com/igusdev/icalc/compare/v2.3.0...v2.3.1) (2024-05-14)

### Bug Fixes

- **data-service:** ignore tests for widen service with File API (ICALC-583) ([#551](https://github.com/igusdev/icalc/issues/551)) ([d01e115](https://github.com/igusdev/icalc/commit/d01e115e880fda4579c3336d1520f15c1c9b9106))

## [2.3.0](https://github.com/igusdev/icalc/compare/v2.2.0...v2.3.0) (2024-05-06)

### Features

- introduce business handling for updating mat017Items (ICALC-469) ([#515](https://github.com/igusdev/icalc/issues/515)) ([1538248](https://github.com/igusdev/icalc/commit/15382482ed15f1478a0c777d9676010c21f802aa))

## [2.2.0](https://github.com/igusdev/icalc/compare/v2.1.0...v2.2.0) (2024-01-16)

### Features

- change rds signer certificate to global-bundle (ICALC-479) ([#452](https://github.com/igusdev/icalc/issues/452)) ([d8dcaf0](https://github.com/igusdev/icalc/commit/d8dcaf0eff3715db73e02aa7e44573efbff9d0b0))

## [2.1.0](https://github.com/igusdev/icalc/compare/v2.0.0...v2.1.0) (2023-12-13)

**Note:** Version bump only for package @igus/icalc-data-service

## [2.0.0](https://github.com/igusdev/icalc/compare/v1.16.0...v2.0.0) (2023-11-27)

**Note:** Version bump only for package @igus/icalc-data-service

## [1.16.0](https://github.com/igusdev/icalc/compare/v1.15.0...v1.16.0) (2023-10-30)

### Features

- **data-import,data-service,libs:** provide data for new worksteps (ICALC-408) ([#421](https://github.com/igusdev/icalc/issues/421)) ([1fa272e](https://github.com/igusdev/icalc/commit/1fa272e8b23fc374be474c4f830c29ee8680dbf3))

## [1.15.0](https://github.com/igusdev/icalc/compare/v1.14.0...v1.15.0) (2023-10-10)

### Features

- introduce handling of updated or removed chainflex prices (ICALC-387, [#415](https://github.com/igusdev/icalc/issues/415)) ([f82d590](https://github.com/igusdev/icalc/commit/f82d590d07975e0ae0ba120c5a7d1fc6d1789d27))

## [1.14.0](https://github.com/igusdev/icalc/compare/v1.13.0...v1.14.0) (2023-08-10)

### Features

- remove assignments between calcs and confs (ICALC-255, [#382](https://github.com/igusdev/icalc/issues/382)) ([83de54b](https://github.com/igusdev/icalc/commit/83de54bfb620558d7685d2fa1867de79156af831))
- update monorepo nx migrate (ICALC-272, [#397](https://github.com/igusdev/icalc/issues/397)) ([fe7f37d](https://github.com/igusdev/icalc/commit/fe7f37d6118ea54778aa1855438aeeb4271fb51b))

## [1.13.0](https://github.com/igusdev/icalc/compare/v1.12.0...v1.13.0) (2023-07-03)

### Features

- upgrade to kopla 11 and nx16 [ICALC-366] ([#359](https://github.com/igusdev/icalc/issues/359)) ([4504392](https://github.com/igusdev/icalc/commit/45043926a9a3d88dae375084de521ece21809b9e))

### Bug Fixes

- **ci:** fix resolve module not found issue [ICALC-366] ([#361](https://github.com/igusdev/icalc/issues/361)) ([79a98a5](https://github.com/igusdev/icalc/commit/79a98a58b2d12f693079bced1b9ca2ceb271d847))

# [1.12.0](https://github.com/igusdev/icalc/compare/v1.11.0...v1.12.0) (2023-06-13)

### Features

- (ICALC-307) tests for locking calculations ([#340](https://github.com/igusdev/icalc/issues/340)) ([0ae9923](https://github.com/igusdev/icalc/commit/0ae9923b481b9d4cf9928ff71124c5e619eaeaca))

# [1.11.0](https://github.com/igusdev/icalc/compare/v1.10.0...v1.11.0) (2023-05-16)

### Bug Fixes

- **ICALC-287:** enforce order of configurations from oldest to latest ([#341](https://github.com/igusdev/icalc/issues/341)) ([2fbcc1b](https://github.com/igusdev/icalc/commit/2fbcc1bf301df5368f7ad6291800039b86c5b9af))

# [1.10.0](https://github.com/igusdev/icalc/compare/v1.9.0...v1.10.0) (2023-05-10)

### Bug Fixes

- (ICALC-351) add check for locked status to linkExisting method ([#331](https://github.com/igusdev/icalc/issues/331)) ([c03aec8](https://github.com/igusdev/icalc/commit/c03aec813ad59c46e5f92ff8d62b8aa9c7480303))
- **icalc-342, icalc-346:** fix workstepOverrides inconsistencies ([#332](https://github.com/igusdev/icalc/issues/332)) ([903aebb](https://github.com/igusdev/icalc/commit/903aebbd43a777e69310765ea734dce384dfb367))

### Features

- **data-service:** return all related calcs in config search if machted ([#336](https://github.com/igusdev/icalc/issues/336)) ([fbf05e7](https://github.com/igusdev/icalc/commit/fbf05e730abf9aab721b677cd45a9ab0b5d50999))

# [1.9.0](https://github.com/igusdev/icalc/compare/v1.8.0...v1.9.0) (2023-04-27)

### Features

- :passport_control: add user to staging and prod ([#319](https://github.com/igusdev/icalc/issues/319)) ([793041e](https://github.com/igusdev/icalc/commit/793041e7022a8b706be34e6aa3f10252d6d55098))
- icalc 257/individual calc factor ([#304](https://github.com/igusdev/icalc/issues/304)) ([25cc94a](https://github.com/igusdev/icalc/commit/25cc94a18123680ea00632b4899c35e7db1e335b))
- icalc 299/assign existing configuration ([#324](https://github.com/igusdev/icalc/issues/324)) ([66a68ad](https://github.com/igusdev/icalc/commit/66a68ad1474bdadcc549b4a07d0620243ea26950))
- icalc 327/response dtos and mapper ([#317](https://github.com/igusdev/icalc/issues/317)) ([5bdeff7](https://github.com/igusdev/icalc/commit/5bdeff77f139d0a9e4b84d8f979f39bf7d1a17c1))
- **icalc-228:** introduce backend for locking of calculations ([#310](https://github.com/igusdev/icalc/issues/310)) ([d54575d](https://github.com/igusdev/icalc/commit/d54575da1ed53f51369ff3a96a24cd71989398e4))
- **icalc-304:** extend configuration with snapshots relation ([#315](https://github.com/igusdev/icalc/issues/315)) ([2b9a0d8](https://github.com/igusdev/icalc/commit/2b9a0d8ff9ecd37f43572ce6a058be551f5be080))

# [1.8.0](https://github.com/igusdev/icalc/compare/v1.7.0...v1.8.0) (2023-04-03)

### Bug Fixes

- **api:** make labelings optional for duplicate ([#302](https://github.com/igusdev/icalc/issues/302)) ([8253378](https://github.com/igusdev/icalc/commit/82533788c8c9ce29a9dfbd31a93a61223746c7d1))

### Features

- icalc 248/commercial rounding ([#294](https://github.com/igusdev/icalc/issues/294)) ([cf8d4c6](https://github.com/igusdev/icalc/commit/cf8d4c624314c748937eaa03bc947c5feaa6661b))
- icalc 273/cli for db seeding ([#287](https://github.com/igusdev/icalc/issues/287)) ([f2925b0](https://github.com/igusdev/icalc/commit/f2925b093790add78526dfc071e09e1698336677))
- **icalc-240:** calculations and configurations ([#290](https://github.com/igusdev/icalc/issues/290)) ([78db8bc](https://github.com/igusdev/icalc/commit/78db8bcd297cc5abfb2dfbec5220cf531e853b56))

# [1.7.0](https://github.com/igusdev/icalc/compare/v1.6.0...v1.7.0) (2023-03-09)

### Features

- add login api cypress tests, ICALC-275 ([#284](https://github.com/igusdev/icalc/issues/284)) ([fe24008](https://github.com/igusdev/icalc/commit/fe24008b57ddacf798884812b8960eaf0dd88745))

# [1.6.0](https://github.com/igusdev/icalc/compare/v1.5.0...v1.6.0) (2023-02-28)

### Bug Fixes

- execute change check logic on clone instead of actual state (addendum to ICALC-211) ([d085cda](https://github.com/igusdev/icalc/commit/d085cda0c87bc6ef0bc6f72f043ce0d9940660bf))

### Features

- icalc 233/excel fixes ([#263](https://github.com/igusdev/icalc/issues/263)) ([ac976f8](https://github.com/igusdev/icalc/commit/ac976f8e491e5e5d7001748687613dc775658066))
- icalc 242/incomplete configurations ([#260](https://github.com/igusdev/icalc/issues/260)) ([94556ba](https://github.com/igusdev/icalc/commit/94556ba292560f963369165c782cc4adc44ebaf5))
- ICALC-247 / set related mat904 items in config search via additional calcul… ([#268](https://github.com/igusdev/icalc/issues/268)) ([68382b7](https://github.com/igusdev/icalc/commit/68382b756eefd26fa7bd3d4e24b3598dc898cdf3))

# [1.5.0](https://github.com/igusdev/icalc/compare/v1.4.0...v1.5.0) (2023-02-03)

### Features

- update akeneo endpoint url, ICALC-243 ([#241](https://github.com/igusdev/icalc/issues/241)) ([806d336](https://github.com/igusdev/icalc/commit/806d3366cb70cbddd704b6fdacf8833882a21cec))

# [1.4.0](https://github.com/igusdev/icalc/compare/v1.3.0...v1.4.0) (2022-12-20)

**Note:** Version bump only for package @igus/icalc-data-service

# [1.3.0](https://github.com/igusdev/icalc/compare/v1.2.0...v1.3.0) (2022-12-12)

**Note:** Version bump only for package @igus/icalc-data-service

# [1.2.0](https://github.com/igusdev/icalc/compare/v1.1.0...v1.2.0) (2022-11-25)

### Bug Fixes

- :ambulance: remove one time use code ([#223](https://github.com/igusdev/icalc/issues/223)) ([ebd972d](https://github.com/igusdev/icalc/commit/ebd972d12906abfe4381ea66c4f93e558ff59aeb))

## [1.1.1](https://github.com/igusdev/icalc/compare/v1.1.0...v1.1.1) (2022-11-17)

### Bug Fixes

- :ambulance: delete the users, create them new and send email ([1151bfc](https://github.com/igusdev/icalc/commit/1151bfc80d18a6f45dec46ea97ce6918dd458e4a))

# [1.1.0](https://github.com/igusdev/icalc/compare/v1.0.0...v1.1.0) (2022-11-16)

**Note:** Version bump only for package @igus/icalc-data-service

## [1.0.1](https://github.com/igusdev/icalc/compare/v1.0.0...v1.0.1) (2022-11-03)

### Bug Fixes

- :bug: save manual inserted workstepvalues permanently ([6c0cc9e](https://github.com/igusdev/icalc/commit/6c0cc9ef71b44efecc2e324bbb4ae3c047adbab1))
- update signup request documentation ([2a473c1](https://github.com/igusdev/icalc/commit/2a473c1814d78fe926c34d2fe5960da086894703))

# [1.0.0](https://github.com/igusdev/icalc/compare/v0.13.4...v1.0.0) (2022-11-02)

### Bug Fixes

- update production email text ([8643872](https://github.com/igusdev/icalc/commit/8643872bb7ce854c6151970afedf005ba215e338))

## [0.13.4](https://github.com/igusdev/icalc/compare/v0.13.3...v0.13.4) (2022-11-01)

### Bug Fixes

- comment back email recipients, small email text changes, ICALC-177 ([0b2aef5](https://github.com/igusdev/icalc/commit/0b2aef51f25d48f45f565a167cd3839c70f32436))

## [0.13.3](https://github.com/igusdev/icalc/compare/v0.13.2...v0.13.3) (2022-11-01)

**Note:** Version bump only for package @igus/icalc-data-service

## [0.13.2](https://github.com/igusdev/icalc/compare/v0.13.0...v0.13.2) (2022-10-27)

### Bug Fixes

- remove mp alias and use the correct alias (m) ([#189](https://github.com/igusdev/icalc/issues/189)) ([b724b7f](https://github.com/igusdev/icalc/commit/b724b7f4192b72426612b826140d56d36711da72))

## [0.13.1](https://github.com/igusdev/icalc/compare/v0.13.0...v0.13.1) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-data-service

# [0.13.0](https://github.com/igusdev/icalc/compare/v0.12.10...v0.13.0) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-data-service

## [0.12.10](https://github.com/igusdev/icalc/compare/v0.12.9...v0.12.10) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-data-service

## [0.12.9](https://github.com/igusdev/icalc/compare/v0.12.8...v0.12.9) (2022-10-26)

**Note:** Version bump only for package @igus/icalc-data-service

## [0.12.8](https://github.com/igusdev/icalc/compare/v0.9.0...v0.12.8) (2022-10-25)

### Features

- cronjob fallback implemented, code refactored ([#183](https://github.com/igusdev/icalc/issues/183)) ([6f3feef](https://github.com/igusdev/icalc/commit/6f3feeffde530ab5abffff7dc7396dc10df69f52))
- icalc 141/data adjustments ([#184](https://github.com/igusdev/icalc/issues/184)) ([dd7908b](https://github.com/igusdev/icalc/commit/dd7908ba7f7f103ce42ce5cd801138431a8e5173))

# [0.9.0](https://github.com/igusdev/icalc/compare/v0.8.0...v0.9.0) (2022-10-14)

### Features

- fixing failed tests ([4c53a53](https://github.com/igusdev/icalc/commit/4c53a53f70f185117e029e0d5013e1098dac5b18))
- icalc 113 / pin assignment (previously: line configuration) ([#171](https://github.com/igusdev/icalc/issues/171)) ([d4cf123](https://github.com/igusdev/icalc/commit/d4cf12330692f518dcb6a2565cea3e73147c139c))
- icalc 46/ Favorites (prefill configurations) ([#173](https://github.com/igusdev/icalc/issues/173)) ([28af0d1](https://github.com/igusdev/icalc/commit/28af0d114f09ffb6a752d9876666a6d1bd4136d3))

# [0.8.0](https://github.com/igusdev/icalc/compare/v0.7.0...v0.8.0) (2022-09-22)

### Bug Fixes

- :bug: display correct unit prices ([#152](https://github.com/igusdev/icalc/issues/152)) ([e1e4ad9](https://github.com/igusdev/icalc/commit/e1e4ad9c50f5629a4d7d18bbcd22b9c8d3ad57c2))
- data-service tests ([38cd97e](https://github.com/igusdev/icalc/commit/38cd97e4ae59df999c4191416e92fbc5f050f6c9))

### Features

- :sparkles: add additional fields to where clause, adjust wordin… ([#150](https://github.com/igusdev/icalc/issues/150)) ([1e3a042](https://github.com/igusdev/icalc/commit/1e3a04292f1b633f20cdcab4d949a16cbb566b2e))
- adjust mat quantity cells, add readme for excel file documentation ([#156](https://github.com/igusdev/icalc/issues/156)) ([b54075a](https://github.com/igusdev/icalc/commit/b54075a898e5b9567a831835077694fded3f8226))
- cronjob fixed with another node package (cron) ([5f1fdeb](https://github.com/igusdev/icalc/commit/5f1fdeb5e8b51cd351bbb046ff7287d7a2b79520))
- disable cronjob ([31d9ebe](https://github.com/igusdev/icalc/commit/31d9ebe8fedd612729fb23b3d1438bce3afacdbc))
- icalc 128/daily akeneo sync ([#154](https://github.com/igusdev/icalc/issues/154)) ([9f54d6e](https://github.com/igusdev/icalc/commit/9f54d6e57eeb4077c92ca824de4f1a75da468174))
- mat017 query is optimized and sql logger integrated ([#148](https://github.com/igusdev/icalc/issues/148)) ([785113a](https://github.com/igusdev/icalc/commit/785113aef005ad49171deb373efb45ad0645b93e))
- prepare PR to drop https listeners ([#165](https://github.com/igusdev/icalc/issues/165)) ([2a33d11](https://github.com/igusdev/icalc/commit/2a33d11dd8e872053d3d0bdae80fda605507d0c0))

# [0.7.0](https://github.com/igusdev/icalc/compare/v0.6.0...v0.7.0) (2022-08-24)

### Features

- correct sql query implemented ([#147](https://github.com/igusdev/icalc/issues/147)) ([5851074](https://github.com/igusdev/icalc/commit/5851074514d12bc9457a27124bf627faf9acdee2))
- icalc 11/logging ([#142](https://github.com/igusdev/icalc/issues/142)) ([4391292](https://github.com/igusdev/icalc/commit/439129255750fc25e8bc3cbcaad3e5ddc94455f2))

# [0.6.0](https://github.com/igusdev/icalc/compare/v0.5.0...v0.6.0) (2022-08-23)

### Bug Fixes

- drop usage of deprecated parseRequest, switch to version ^7.8.1 of @sentry/node ([#136](https://github.com/igusdev/icalc/issues/136)) ([824d1a2](https://github.com/igusdev/icalc/commit/824d1a260b49be783a3a91a605b66f11591a68e3))

### Features

- :sparkles: add factored total price to calc result, display on … ([#144](https://github.com/igusdev/icalc/issues/144)) ([c0343c7](https://github.com/igusdev/icalc/commit/c0343c7d7591408a5da5827245cfba829069565d))
- #deletion of the chainflex create table statemenet ([ae7ed91](https://github.com/igusdev/icalc/commit/ae7ed919a784d524608c02f9530112674d712ce9))
- calculation of unit amout ([#143](https://github.com/igusdev/icalc/issues/143)) ([588f059](https://github.com/igusdev/icalc/commit/588f059f10f39f6dca600e8b20ebb213b4be31ef))
- Fix for integration ([0053fd6](https://github.com/igusdev/icalc/commit/0053fd640a952d4e45e375e8cad77fb620e4178a))
- icalc 27/calculation step ([#132](https://github.com/igusdev/icalc/issues/132)) ([601e912](https://github.com/igusdev/icalc/commit/601e9125b6376892f90f4b0dad516f196e662519))
- test failures fixed ([5e36c16](https://github.com/igusdev/icalc/commit/5e36c163ec1f4c7c58812599151ef380a7533a8c))

# [0.5.0](https://github.com/igusdev/icalc/compare/v0.4.0...v0.5.0) (2022-08-01)

### Features

- chainflex import does not drop table (V7 does that) ([c9d065d](https://github.com/igusdev/icalc/commit/c9d065de05f7161e6883a149b142cd89706f169d))

# [0.4.0](https://github.com/igusdev/icalc/compare/v0.3.0...v0.4.0) (2022-08-01)

### Features

- chainflex drop create test on staging + data-service debug profile ([9dcdaf2](https://github.com/igusdev/icalc/commit/9dcdaf240450bb07ce3505c17294fd6e733e94e3))

# [0.3.0](https://github.com/igusdev/icalc/compare/v0.2.5...v0.3.0) (2022-07-29)

### Features

- Commiting a change for bump ([01be806](https://github.com/igusdev/icalc/commit/01be80618d55fbf39aff2b3db6b8459649710f6d))

## [0.2.5](https://github.com/igusdev/icalc/compare/v0.2.4...v0.2.5) (2022-07-29)

**Note:** Version bump only for package @igus/icalc-data-service

# [0.2.0](https://github.com/igusdev/icalc/compare/v0.1.0...v0.2.0) (2022-07-22)

### Bug Fixes

- **data-service:** resolve startup issues ([#114](https://github.com/igusdev/icalc/issues/114)) ([81cfea6](https://github.com/igusdev/icalc/commit/81cfea6a13f176a2a28d83145147270d193041a5))

### Features

- :fire: first version of the results page (only html placeholders) ([#25](https://github.com/igusdev/icalc/issues/25)) ([fe5b5ef](https://github.com/igusdev/icalc/commit/fe5b5ef6fb3b1c3da56da256ba794f0f062d8d16))
- :sparkles: add postgres staging environment variables ([#120](https://github.com/igusdev/icalc/issues/120)) ([b18df5c](https://github.com/igusdev/icalc/commit/b18df5c35b527182ea64eea4ab457f6d8097adaf))
- :zap: assest included in dist for data service ([f816bcb](https://github.com/igusdev/icalc/commit/f816bcb81c40f514367082e823c5006be2fb3006))
- :zap: lınt errors due to updates fıxed ([48251f3](https://github.com/igusdev/icalc/commit/48251f3552bc63e98a86bbedc906d8bf7ded96f4))
- csv files which hold the data from AX are used by postgres [ICALC-96] ([76942b4](https://github.com/igusdev/icalc/commit/76942b4e5511b7b667a4756e3d14a946f633d946))
- first serverside excel download finished ([ef1a336](https://github.com/igusdev/icalc/commit/ef1a336c75aa2440b928fd19d239588f2534fa5c))
- icalc 67/adjust chainflex backend ([#115](https://github.com/igusdev/icalc/issues/115)) ([f70b0b3](https://github.com/igusdev/icalc/commit/f70b0b3ca04362d88fdf45329bdb4585faf704b0))
- icalc 80/show data ([#105](https://github.com/igusdev/icalc/issues/105)) ([620a59e](https://github.com/igusdev/icalc/commit/620a59ead76eea249137051bedfd563a3a3efa81))
- icalc 81/show connector data ([#111](https://github.com/igusdev/icalc/issues/111)) ([f1a771a](https://github.com/igusdev/icalc/commit/f1a771a3283c5817e55affd11f937022a9347dbe))
- implement chainflex basic UI ([#22](https://github.com/igusdev/icalc/issues/22)) ([69647ac](https://github.com/igusdev/icalc/commit/69647acdc7f70618e07491e8f4e948c07fa48b93))
- lint errors fixed for the pipeline ([a644048](https://github.com/igusdev/icalc/commit/a6440484bf8c691e7d3993e05e676534a6be289a))
- nx migration done ([#52](https://github.com/igusdev/icalc/issues/52)) ([e1dd038](https://github.com/igusdev/icalc/commit/e1dd0385bda23a94bb1112de59fa039977e6a3ba))
- postGresConfig executed after aws token is acuired ([419398b](https://github.com/igusdev/icalc/commit/419398b379f74ee153d87fb395cf1b70e2391642))
- testing errors fixed ([f1446cb](https://github.com/igusdev/icalc/commit/f1446cb37d8332487502398f707b40790c1a3969))

# [0.1.0](https://github.com/igusdev/icalc/compare/v0.0.4...v0.1.0) (2022-03-16)

### Features

- add dummy module 'test' to data-service([#7](https://github.com/igusdev/icalc/issues/7)) ([1f34bc5](https://github.com/igusdev/icalc/commit/1f34bc512aa87a5f1bcc9ab0cfb1a92781cd299f))

## [0.0.4](https://github.com/igusdev/icalc/compare/v0.0.2...v0.0.4) (2022-03-16)

**Note:** Version bump only for package @igus/icalc-data-service

**Note:** Version bump only for package @igus/icalc-data-service

## 0.0.2 (2022-03-14)

### Bug Fixes

- adjust configs ([#2](https://github.com/igusdev/icalc/issues/2)) ([8302fe8](https://github.com/igusdev/icalc/commit/8302fe856a01541873dc9b7dcf53651d3021936a))
