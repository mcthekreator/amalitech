# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.8.0](https://github.com/igusdev/icalc/compare/v2.7.1...v2.8.0) (2024-09-11)

### Features

- **calculator, libs:** show correct chainflex number of cores and nominal cross section in excel (ICALC-767) ([#667](https://github.com/igusdev/icalc/issues/667)) ([260e76b](https://github.com/igusdev/icalc/commit/260e76b61048ae88911ef484eea60002f3c115c9))

### Bug Fixes

- **calculator:** fix failing unit test (ICALC-767) ([#668](https://github.com/igusdev/icalc/issues/668)) ([8dfc7ac](https://github.com/igusdev/icalc/commit/8dfc7ac8d64a314cc58315ef1d899df93d69ad89))
- **calculator:** trigger matItem removal info dialog if manually created mat017Item in BOM is removed (ICALC-634) ([#660](https://github.com/igusdev/icalc/issues/660)) ([e9a3c60](https://github.com/igusdev/icalc/commit/e9a3c60d5f76858c1a5817db4020b840620f3702))

## [2.7.1](https://github.com/igusdev/icalc/compare/v2.7.0...v2.7.1) (2024-08-20)

### Bug Fixes

- **calculator:** correct the formatting errors in the individual calculation factors when using iCalc in the German language. (ICALC-756) ([#659](https://github.com/igusdev/icalc/issues/659)) ([9879cae](https://github.com/igusdev/icalc/commit/9879cae450105fb26785ce7d00a03bc9be263615))

## [2.7.0](https://github.com/igusdev/icalc/compare/v2.6.0...v2.7.0) (2024-08-15)

### Features

- add configuration description to create a copy of configuration dialogues (ICALC-698) ([#626](https://github.com/igusdev/icalc/issues/626)) ([193023f](https://github.com/igusdev/icalc/commit/193023fdd77aa4c645e075fd2f9e25a8de221c31))
- add quote number and customer to meta data and dialogues (ICALC-711) ([#643](https://github.com/igusdev/icalc/issues/643)) ([5c32a2c](https://github.com/igusdev/icalc/commit/5c32a2c6f76766c51b52df2c05708474ff550594))
- **calculator, calculator-e2e:** add basic setup for cypress component mode tests (ICALC-633) ([#633](https://github.com/igusdev/icalc/issues/633)) ([83e17fe](https://github.com/igusdev/icalc/commit/83e17fecd8ad57d15c1baa3d63a34affea59b6ac))
- **calculator, data-service:** replace matplan download button with select input(ICALC-706) ([#638](https://github.com/igusdev/icalc/issues/638)) ([aa21b07](https://github.com/igusdev/icalc/commit/aa21b07a74603ed3ea2718fa04debf2e08445750))
- **calculator, libs, calculator-e2e:** show configuration description on result page (ICALC-676) ([#635](https://github.com/igusdev/icalc/issues/635)) ([343a58d](https://github.com/igusdev/icalc/commit/343a58dc6b51c75f46d0c9672e5247144a8cbea9))
- **calculator, libs:** replace labeling fields with configuration description in calculation excel export (ICALC-677) ([#636](https://github.com/igusdev/icalc/issues/636)) ([abab792](https://github.com/igusdev/icalc/commit/abab7929711fa44875bad95ffd2ff0905f7e56bc))
- **calculator:** show spinner and disable button during excel download (ICALC-721) ([#642](https://github.com/igusdev/icalc/issues/642)) ([44af507](https://github.com/igusdev/icalc/commit/44af507e2ac39061e57c121e4ec1f8951be12315))
- show more mat017 item data for pin assignment (ICALC-286) ([#649](https://github.com/igusdev/icalc/issues/649)) ([5f6794c](https://github.com/igusdev/icalc/commit/5f6794c6772ee3d3ac67b3fe045f262593cba41c))

### Bug Fixes

- **calculator, libs:** adjust rendering of meta-data-form to avoid issues with cy.type (ICALC-741) ([#655](https://github.com/igusdev/icalc/issues/655)) ([4fce2e8](https://github.com/igusdev/icalc/commit/4fce2e87e5067961cbd6f302a459b4791eadb9be))
- **calculator, libs:** correct configuration description bugs in iCalc (ICALC-741) ([#647](https://github.com/igusdev/icalc/issues/647)) ([7dc6cca](https://github.com/igusdev/icalc/commit/7dc6cca919a08fe7621853726b98f329a361e295))
- **calculator:** fix failing unit test (ICALC-676) ([#641](https://github.com/igusdev/icalc/issues/641)) ([801c94f](https://github.com/igusdev/icalc/commit/801c94f7ed6595852469d74c41127969dad0ee71))
- **calculator:** fix failing unit test (ICALC-698) ([#632](https://github.com/igusdev/icalc/issues/632)) ([d9336e5](https://github.com/igusdev/icalc/commit/d9336e531d67fed30bd628c988bd348873aa9aaf))
- **calculator:** remove whitespace from chainflex and Mat017 item update and removal info boxes on result page (ICALC-749) ([#652](https://github.com/igusdev/icalc/issues/652)) ([f7b02ac](https://github.com/igusdev/icalc/commit/f7b02accfa0020466270bd986af256a641e52685))

## [2.6.0](https://github.com/igusdev/icalc/compare/v2.5.0...v2.6.0) (2024-07-17)

### Features

- **calculator, libs:** download mat-plan in .xls by default (ICALC-683) ([#623](https://github.com/igusdev/icalc/issues/623)) ([e063bf6](https://github.com/igusdev/icalc/commit/e063bf68faad630f9d9928ee728c00f6b2dd4f57))
- include configuration description field in meta data form [disabled by "feature flag"] (ICALC-675) ([#620](https://github.com/igusdev/icalc/issues/620)) ([f704560](https://github.com/igusdev/icalc/commit/f704560fa003ad4f147eebf78d9e6800dfeec1c2))

### Bug Fixes

- **calculator:** hide error messages regarding duplicates in form correctly (ICALC-670) ([#624](https://github.com/igusdev/icalc/issues/624)) ([8b1fb4d](https://github.com/igusdev/icalc/commit/8b1fb4d6df462147f0adc3055690c8561a4045f2))

## [2.5.0](https://github.com/igusdev/icalc/compare/v2.4.2...v2.5.0) (2024-07-02)

### Features

- **calculator:** increase maximum length for chainflex to 10000 (ICALC-685) ([#614](https://github.com/igusdev/icalc/issues/614)) ([8e59067](https://github.com/igusdev/icalc/commit/8e590674d5dd869f64dff95938b1e406a701d644))
- **calculator:** position customer type and calculation factor side by side on meta data page (ICALC-538) ([#606](https://github.com/igusdev/icalc/issues/606)) ([54b2f37](https://github.com/igusdev/icalc/commit/54b2f37ce7c532bc75737dfd926bb45924030941))

## [2.4.3](https://github.com/igusdev/icalc/compare/v2.4.2...v2.4.3) (2024-06-24)

**Note:** Version bump only for package @igus/icalc-calculator

## [2.4.2](https://github.com/igusdev/icalc/compare/v2.4.1...v2.4.2) (2024-06-17)

**Note:** Version bump only for package @igus/icalc-calculator

## [2.4.1](https://github.com/igusdev/icalc/compare/v2.4.0...v2.4.1) (2024-06-14)

### Features

- **calculator:** add mouse hover to "add to end of list button" (ICALC-668) ([#603](https://github.com/igusdev/icalc/issues/603)) ([f05718f](https://github.com/igusdev/icalc/commit/f05718fccf0c4bbb64d782813d89b830c1e3c0d8))

## [2.4.0](https://github.com/igusdev/icalc/compare/v2.3.0...v2.4.0) (2024-06-13)

### Features

- allow deletion of manually created item from results table on connector steps (ICALC-627) ([#571](https://github.com/igusdev/icalc/issues/571)) ([930954a](https://github.com/igusdev/icalc/commit/930954abbe216a84c49ede8c9da458e41522bc93))
- add filter for manually created Mat017 items (ICALC-625) ([#560](https://github.com/igusdev/icalc/issues/560)) ([02400e4](https://github.com/igusdev/icalc/commit/02400e4fa90ac9b6c51dc6dee565fb730bf35f9f))
- **calculator, libs:** add removal of spaces and tabs in calculation number and configuration mat number on meta data page (ICALC-660) ([#594](https://github.com/igusdev/icalc/issues/594)) ([0e5973e](https://github.com/igusdev/icalc/commit/0e5973e84b6e8ffdd2a7d52cffaf74f48a977feb))
- **calculator:** apply remove tabs and space logic to dialogs (ICALC-661) ([#595](https://github.com/igusdev/icalc/issues/595)) ([112cc8d](https://github.com/igusdev/icalc/commit/112cc8d04f2fe9d45588911b14e1757bd2783212))
- **calculator:** reduce text in results step info boxes (ICALC-631, [#567](https://github.com/igusdev/icalc/issues/567)) ([07d5613](https://github.com/igusdev/icalc/commit/07d5613444b199eb2417f2a16e05c379db79a9d3))
- integrate iERP service and automate data import (ICALC-127, [#569](https://github.com/igusdev/icalc/issues/569)) ([50e767d](https://github.com/igusdev/icalc/commit/50e767d5d27a0960055414efd148c4f8feeabac0))
- introduce manual creation of mat017 items (ICALC-617) ([#597](https://github.com/igusdev/icalc/issues/597)) ([014cdc7](https://github.com/igusdev/icalc/commit/014cdc7ecaaaf5fe5eb093fca2c3886024b12778))

### Bug Fixes

- **calculator:** adjust environment files to equal each other in function type (ICALC-543) ([#565](https://github.com/igusdev/icalc/issues/565)) ([e1449bc](https://github.com/igusdev/icalc/commit/e1449bc714de9590da4cacd2269efa1d68ee2352))
- **calculator:** adjust trailing comma to fix linting errors ([#566](https://github.com/igusdev/icalc/issues/566)) ([a3ef907](https://github.com/igusdev/icalc/commit/a3ef907d3ab06ded045ae152be42a76354c0ef02))
- **calculator:** only show items in price update modal that are active or inactive and have a price change (ICALC-653) ([#591](https://github.com/igusdev/icalc/issues/591)) ([881dcb5](https://github.com/igusdev/icalc/commit/881dcb50f720ea90d2b8715bce1465011cd19a88))
- **libs:** add jwt expiration times and bump version v2.3.2 (ICALC-637) ([#575](https://github.com/igusdev/icalc/issues/575)) ([41b6ee7](https://github.com/igusdev/icalc/commit/41b6ee746f8f06f9b2f8c7b9225fae9ba4831e03))

### Reverts

- Revert "v2.3.4" ([c35ba61](https://github.com/igusdev/icalc/commit/c35ba61a906077b66ca04972b5da5aed8ebeb897))
- Revert "v2.4.0" ([5050c62](https://github.com/igusdev/icalc/commit/5050c6229068272c42af40711c60514233d31edf))

## [2.3.2](https://github.com/igusdev/icalc/compare/v2.3.1...v2.3.2) (2024-05-31)

**Note:** Version bump only for package @igus/icalc-calculator

## [2.3.1](https://github.com/igusdev/icalc/compare/v2.3.0...v2.3.1) (2024-05-14)

### Features

- add dataCy to disabled excel button ([ab2ab53](https://github.com/igusdev/icalc/commit/ab2ab53bd2e1df3556125de5bea002429ae694d9))
- add isCompleteData flag to handle incomplete configuration ([4b24f0d](https://github.com/igusdev/icalc/commit/4b24f0d44f0ce1c05e098233a6cc62f2417f2c68))
- add isCompleteData method for incomplete configuration ([3e566ca](https://github.com/igusdev/icalc/commit/3e566cae148d32cdcf595a7387f326ef77f1de04))

## [2.3.1](https://github.com/igusdev/icalc/compare/v2.3.0...v2.3.1) (2024-05-14)

### Features

- add dataCy to disabled button ([d86a56a](https://github.com/igusdev/icalc/commit/d86a56a6afe067cc93e5890adbf8bc9d630ed0aa))

## [2.3.1](https://github.com/igusdev/icalc/compare/v2.3.0...v2.3.1) (2024-05-14)

### Features

- add dataCy to disabled button ([d86a56a](https://github.com/igusdev/icalc/commit/d86a56a6afe067cc93e5890adbf8bc9d630ed0aa))

## [2.3.0](https://github.com/igusdev/icalc/compare/v2.2.0...v2.3.0) (2024-05-06)

### Features

- introduce business handling for updating mat017Items (ICALC-469) ([#515](https://github.com/igusdev/icalc/issues/515)) ([1538248](https://github.com/igusdev/icalc/commit/15382482ed15f1478a0c777d9676010c21f802aa))

### Bug Fixes

- **calculator, calculator-e2e:** add sorting by mat number table header in e2e test to be sure to select the same mat017 item each time (ICALC-610) ([#535](https://github.com/igusdev/icalc/issues/535)) ([d7a93aa](https://github.com/igusdev/icalc/commit/d7a93aa4e5df3125ac6367ad900350f2ed63402d))
- **calculator, calculator-e2e:** enhance pin assignments of MAT017 items (ICALC-474, ICALC-559) ([#494](https://github.com/igusdev/icalc/issues/494)) ([754327b](https://github.com/igusdev/icalc/commit/754327b0029c62dfb9485b08fdc06185509f083d))
- **calculator, libs:** bug fixes for mat017 item update (ICALC-595) ([#536](https://github.com/igusdev/icalc/issues/536)) ([ef85d97](https://github.com/igusdev/icalc/commit/ef85d97266fc3353fca30a22477460cb369fa884))
- **calculator:** show correct snackbar for work step quantity overwrites (ICALC-556) ([#492](https://github.com/igusdev/icalc/issues/492)) ([6bf0d01](https://github.com/igusdev/icalc/commit/6bf0d01d65f7da2364d98945458b3df2bc351744))
- main bug fixes branch for icalc 469 (ICALC-595) ([#539](https://github.com/igusdev/icalc/issues/539)) ([ceb6c05](https://github.com/igusdev/icalc/commit/ceb6c058d289681e58ee991563a503b01579ef66))

## [2.2.0](https://github.com/igusdev/icalc/compare/v2.1.0...v2.2.0) (2024-01-16)

### Features

- **calculator, libs, calculator-e2e:** adjust saveSingleCableCalculation endpoint (ICALC-514) ([#461](https://github.com/igusdev/icalc/issues/461)) ([e15d7ed](https://github.com/igusdev/icalc/commit/e15d7edadf366c47941ba29c47a91c725b9c37ea))

## [2.1.0](https://github.com/igusdev/icalc/compare/v2.0.0...v2.1.0) (2023-12-13)

### Features

- add work step sets (ICALC-456, ICALC-532, ICALC-466) ([#472](https://github.com/igusdev/icalc/issues/472)) ([22860e4](https://github.com/igusdev/icalc/commit/22860e401d5860ee4d7198bb9845c0edbabc4c2e))

### Bug Fixes

- **calculator:** populate properly libraryState for new configs (ICALC-530) ([#469](https://github.com/igusdev/icalc/issues/469)) ([775ad21](https://github.com/igusdev/icalc/commit/775ad213d0809ba14be87a09ed11d6a360f057db))
- **calculator:** resolve pin sub-options reset issue(ICALC-467) ([#454](https://github.com/igusdev/icalc/issues/454)) ([45b4dba](https://github.com/igusdev/icalc/commit/45b4dba59e173c382475c343dbd9b751a8e078e6))
- **calculator:** unnecessary update of calculation modification date (ICALC-468) ([#462](https://github.com/igusdev/icalc/issues/462)) ([3b50f60](https://github.com/igusdev/icalc/commit/3b50f6076f7ec7de217d0d14bb9f52d7621933cc))
- **libs:** prevent runtime error in process.service (ICALC-534, [#475](https://github.com/igusdev/icalc/issues/475)) ([8936042](https://github.com/igusdev/icalc/commit/89360424d9c24adec36ea33072322feead5668cc))

## [2.0.0](https://github.com/igusdev/icalc/compare/v1.16.0...v2.0.0) (2023-11-27)

### Bug Fixes

- **calculator:** preserve existing rightConnectorState while leaving leftConnector page (ICALC-529) ([#468](https://github.com/igusdev/icalc/issues/468)) ([3d4fe75](https://github.com/igusdev/icalc/commit/3d4fe75e0f0a177828419054cd74f71caec26ba4))

## [1.16.0](https://github.com/igusdev/icalc/compare/v1.15.0...v1.16.0) (2023-10-30)

### Features

- introduce risk factors (ICALC-443, ICALC-463, [#426](https://github.com/igusdev/icalc/issues/426)) ([7043811](https://github.com/igusdev/icalc/commit/7043811e8959585cf1bd16ddc8f5831c90570e25))

### Bug Fixes

- **calculator, calculator-e2e:** switch decorator selectors for action & value dialogs, add e2e test (ICALC-510, [#440](https://github.com/igusdev/icalc/issues/440)) ([caa918f](https://github.com/igusdev/icalc/commit/caa918fae76b484dc531e8b7f2adf73fd86b97d3))
- **calculator:** prevent override of class member accessibility rule (ICALC-365) ([#433](https://github.com/igusdev/icalc/issues/433)) ([efec1a9](https://github.com/igusdev/icalc/commit/efec1a9ad81778d8b7e5e48757d3f6a2962fb6cd))
- **calculator:** prevent override of class member accessibility rule(ICALC-365) ([3ce3a93](https://github.com/igusdev/icalc/commit/3ce3a93653b1c59300eaaf975bb210ddff5f8755))

## [1.15.0](https://github.com/igusdev/icalc/compare/v1.14.0...v1.15.0) (2023-10-10)

### Features

- create switch option for switching through work steps (ICALC-455) ([#407](https://github.com/igusdev/icalc/issues/407)) ([44bbc6c](https://github.com/igusdev/icalc/commit/44bbc6c953a4b61c3850b983668c62dc754065b9))
- introduce handling of updated or removed chainflex prices (ICALC-387, [#415](https://github.com/igusdev/icalc/issues/415)) ([f82d590](https://github.com/igusdev/icalc/commit/f82d590d07975e0ae0ba120c5a7d1fc6d1789d27))
- move 'select connector sets' button to footer (ICALC-430, [#400](https://github.com/igusdev/icalc/issues/400)) ([20844ff](https://github.com/igusdev/icalc/commit/20844ff9239b9250431c45535045b680518a65c2))

### Bug Fixes

- **calculator-e2e:** create switch options for work sets ([#409](https://github.com/igusdev/icalc/issues/409)) ([0c348d7](https://github.com/igusdev/icalc/commit/0c348d7cb21801eed10e7e6a43a22fdc5f1f0072))

## [1.14.0](https://github.com/igusdev/icalc/compare/v1.13.0...v1.14.0) (2023-08-10)

### Features

- allow only one snapshot of given config within a calculation (ICALC-362) ([#372](https://github.com/igusdev/icalc/issues/372)) ([e23d8e6](https://github.com/igusdev/icalc/commit/e23d8e6a7c4f2253097031b50430551c712bc096))
- remove assignments between calcs and confs (ICALC-255, [#382](https://github.com/igusdev/icalc/issues/382)) ([83de54b](https://github.com/igusdev/icalc/commit/83de54bfb620558d7685d2fa1867de79156af831))
- track and show who worked on calcs configs (ICALC-246, [#364](https://github.com/igusdev/icalc/issues/364)) ([9d3d8ea](https://github.com/igusdev/icalc/commit/9d3d8ea7d38d6c90d5261baceeb9f55e20445286))

### Bug Fixes

- **calculator-e2e:** search for selected configuration via search field (ICALC-255, [#396](https://github.com/igusdev/icalc/issues/396)) ([688181b](https://github.com/igusdev/icalc/commit/688181b3e3ae1ba4f6758a63f2ca0f08c358773e))
- **calculator, calculator-e2e:** display calc number after new assignment (ICALC-402) ([4b3fe9a](https://github.com/igusdev/icalc/commit/4b3fe9a778e6d9f390e4586bb0e8acae7a2409c0))
- ensure approval is not revoked and pin assignment image is saved correctly (ICALC-330, ICALC-454) ([#394](https://github.com/igusdev/icalc/issues/394)) ([631a02b](https://github.com/igusdev/icalc/commit/631a02b22fb8fa28ad8b0b4121503d2ecb7669df))
- show roll up input on pin assignment image, rename pin assignment headlines (ICALC-417, ICALC-421, [#378](https://github.com/igusdev/icalc/issues/378)) ([6b9edc2](https://github.com/igusdev/icalc/commit/6b9edc2e78478d57399ea5f310ee0591333e2ef9))

## [1.13.0](https://github.com/igusdev/icalc/compare/v1.12.0...v1.13.0) (2023-07-03)

### Features

- upgrade to kopla 11 and nx16 [ICALC-366] ([#359](https://github.com/igusdev/icalc/issues/359)) ([4504392](https://github.com/igusdev/icalc/commit/45043926a9a3d88dae375084de521ece21809b9e))

### Bug Fixes

- **calculator:** fix info I disappearing on results page [CALC-397] ([#362](https://github.com/igusdev/icalc/issues/362)) ([3c739d7](https://github.com/igusdev/icalc/commit/3c739d7e883e1f7170f9fe07a8f1b87e6e4335ae))
- **calculator:** get configuration data for calculation excel export from snapshot when calculation is locked (ICALC-405, [#365](https://github.com/igusdev/icalc/issues/365)) ([534852a](https://github.com/igusdev/icalc/commit/534852ac0dcbad04d2ecec3c3cdfad8c97e1c946))
- remove 'twisting' items from iterated array for generated forms (ICALC-419, [#376](https://github.com/igusdev/icalc/issues/376)) ([9908483](https://github.com/igusdev/icalc/commit/9908483ce559edeafb324d0736bde6219269a6a4))
- saving changes in step 6 when navigating backwards (ICALC-395, [#358](https://github.com/igusdev/icalc/issues/358)) ([5938b7c](https://github.com/igusdev/icalc/commit/5938b7cccdd28e05a5da749f4f22bdb7b13000ef))
- workstep overrides get lost when selecting items from config search (ICALC-403, [#375](https://github.com/igusdev/icalc/issues/375)) ([d75fc67](https://github.com/igusdev/icalc/commit/d75fc6728956033c42620f15f62637873aa9c424))

# [1.12.0](https://github.com/igusdev/icalc/compare/v1.11.0...v1.12.0) (2023-06-13)

### Bug Fixes

- (ICALC-312) save updated cf length when going to step 1 ([#347](https://github.com/igusdev/icalc/issues/347)) ([1519e02](https://github.com/igusdev/icalc/commit/1519e02a250567ac763435d8fa7d71587eb2a162))
- add back removed line, ICALC-388 ([#351](https://github.com/igusdev/icalc/issues/351)) ([334b850](https://github.com/igusdev/icalc/commit/334b850683e51922ba770851b7dc09a915641789))
- **calculator:** fix sketch issues with snapshots (icalc-340) ([#350](https://github.com/igusdev/icalc/issues/350)) ([c031ac9](https://github.com/igusdev/icalc/commit/c031ac9620eea78c4b8b319aca02994e4af100a9))
- processResultsByKey never assigned ([#354](https://github.com/igusdev/icalc/issues/354)) ([63b695f](https://github.com/igusdev/icalc/commit/63b695fb725cbd7759f501a448b8bb8c5505e8bb))
- return reloaded calculation including sccs, set relatedSCCs with retuned sccs (ICALC-391, [#353](https://github.com/igusdev/icalc/issues/353)) ([e9d9873](https://github.com/igusdev/icalc/commit/e9d98736717cbd93114358ea560268695cf840b2))
- set cf length in state & db (ICALC-312, [#352](https://github.com/igusdev/icalc/issues/352)) ([17e2c30](https://github.com/igusdev/icalc/commit/17e2c30fed4bd809f1de87024b2b20fe0fe9e8aa))

# [1.11.0](https://github.com/igusdev/icalc/compare/v1.10.0...v1.11.0) (2023-05-16)

### Bug Fixes

- **ICALC-287:** enforce order of configurations from oldest to latest ([#341](https://github.com/igusdev/icalc/issues/341)) ([2fbcc1b](https://github.com/igusdev/icalc/commit/2fbcc1bf301df5368f7ad6291800039b86c5b9af))

### Features

- :sparkles: add supplier ids to mat017 item cards in library step ([#339](https://github.com/igusdev/icalc/issues/339)) ([d35f964](https://github.com/igusdev/icalc/commit/d35f96408bcea9e38fbe74a0db3eb3c75a1bbbc0))
- :sparkles: show cf diameter in production plan with a symbol ([#338](https://github.com/igusdev/icalc/issues/338)) ([ef22d6f](https://github.com/igusdev/icalc/commit/ef22d6f1601363c6e1aeda6c0570bc179f352495))

# [1.10.0](https://github.com/igusdev/icalc/compare/v1.9.0...v1.10.0) (2023-05-10)

### Bug Fixes

- **icalc-342, icalc-346:** fix workStepOverrides inconsistencies ([#332](https://github.com/igusdev/icalc/issues/332)) ([903aebb](https://github.com/igusdev/icalc/commit/903aebbd43a777e69310765ea734dce384dfb367))

# [1.9.0](https://github.com/igusdev/icalc/compare/v1.8.0...v1.9.0) (2023-04-27)

### Bug Fixes

- :ambulance: change http requests to use variable depending on environment ([#311](https://github.com/igusdev/icalc/issues/311)) ([e59291b](https://github.com/igusdev/icalc/commit/e59291bf5d5885fa256dca33334b0321fbe7ac79))
- (ICALC-344) add if clause to check for existing work steps form ([#325](https://github.com/igusdev/icalc/issues/325)) ([d8463a5](https://github.com/igusdev/icalc/commit/d8463a549182597dfdbbf4ba2df310715e7cc572))
- (ICALC-344) adjust env variable for new dialog component ([#326](https://github.com/igusdev/icalc/issues/326)) ([5a0070c](https://github.com/igusdev/icalc/commit/5a0070cc96de8fcd7f6559899f9f18c7567eb9c5))

### Features

- icalc 257/individual calc factor ([#304](https://github.com/igusdev/icalc/issues/304)) ([25cc94a](https://github.com/igusdev/icalc/commit/25cc94a18123680ea00632b4899c35e7db1e335b))
- icalc 299/assign existing configuration ([#324](https://github.com/igusdev/icalc/issues/324)) ([66a68ad](https://github.com/igusdev/icalc/commit/66a68ad1474bdadcc549b4a07d0620243ea26950))
- **icalc-228:** introduce backend for locking of calculations ([#310](https://github.com/igusdev/icalc/issues/310)) ([d54575d](https://github.com/igusdev/icalc/commit/d54575da1ed53f51369ff3a96a24cd71989398e4))
- **icalc-251:** handle locked calculations in frontend ([#322](https://github.com/igusdev/icalc/issues/322)) ([f0d981b](https://github.com/igusdev/icalc/commit/f0d981b1d80b8f4791543e32be5084286f274bd6))

# [1.8.0](https://github.com/igusdev/icalc/compare/v1.7.0...v1.8.0) (2023-04-03)

### Bug Fixes

- component test, ICALC-270 ([0151c51](https://github.com/igusdev/icalc/commit/0151c51f3c8c4616d44077ad052cc48a6846f03a))
- **meta-data:** set state properly after selecting in search ([#301](https://github.com/igusdev/icalc/issues/301)) ([6278a33](https://github.com/igusdev/icalc/commit/6278a33c902f70e2eb9f792c8a9a3924d1624452))

### Features

- icalc 139/fractions ([#289](https://github.com/igusdev/icalc/issues/289)) ([e73dcb6](https://github.com/igusdev/icalc/commit/e73dcb653c4e0130d4e8a37b0751b722764c0191))
- icalc 248/commercial rounding ([#294](https://github.com/igusdev/icalc/issues/294)) ([cf8d4c6](https://github.com/igusdev/icalc/commit/cf8d4c624314c748937eaa03bc947c5feaa6661b))
- icalc 273/cli for db seeding ([#287](https://github.com/igusdev/icalc/issues/287)) ([f2925b0](https://github.com/igusdev/icalc/commit/f2925b093790add78526dfc071e09e1698336677))
- **icalc-240:** calculations and configurations ([#290](https://github.com/igusdev/icalc/issues/290)) ([78db8bc](https://github.com/igusdev/icalc/commit/78db8bcd297cc5abfb2dfbec5220cf531e853b56))

# [1.7.0](https://github.com/igusdev/icalc/compare/v1.6.0...v1.7.0) (2023-03-09)

### Bug Fixes

- incomprehensible state, ICALC-281 ([#286](https://github.com/igusdev/icalc/issues/286)) ([7bd073b](https://github.com/igusdev/icalc/commit/7bd073b15b4a5464a02a3b63ff6e75fdf5ca90e4))
- No more dropdown for either Config nor Calc shows, ICALC-274 ([#285](https://github.com/igusdev/icalc/issues/285)) ([8dca028](https://github.com/igusdev/icalc/commit/8dca0286b6e8810e353e677d29569390788606c3))

# [1.6.0](https://github.com/igusdev/icalc/compare/v1.5.0...v1.6.0) (2023-02-28)

### Bug Fixes

- :ambulance: replace deprecated 'pluck' with 'map' ([5599a6a](https://github.com/igusdev/icalc/commit/5599a6a469a3a1f2772bd909040e49fa15671b47))
- dialog action alignment, dialog width, pin-assignment select width, ICALC-253 ([#282](https://github.com/igusdev/icalc/issues/282)) ([8e8b7bb](https://github.com/igusdev/icalc/commit/8e8b7bb6a475790a120b4d58e762a54093254b6d))
- ICALC-260 / set process state information when switching to another mat ite… ([#267](https://github.com/igusdev/icalc/issues/267)) ([ba0fbfa](https://github.com/igusdev/icalc/commit/ba0fbfaed0eec4b909577194bece4c1809d8e5c7))

### Features

- adjust navigation-menu styling ([#266](https://github.com/igusdev/icalc/issues/266)) ([f2faf62](https://github.com/igusdev/icalc/commit/f2faf6221569396d68c001e6adce9250bf2f8dd9))
- icalc 242/incomplete configurations ([#260](https://github.com/igusdev/icalc/issues/260)) ([94556ba](https://github.com/igusdev/icalc/commit/94556ba292560f963369165c782cc4adc44ebaf5))
- icalc 245/various fixes ([#264](https://github.com/igusdev/icalc/issues/264)) ([58c36c9](https://github.com/igusdev/icalc/commit/58c36c95e6688bdc5a3b8446c96c64c46e95608c))
- ICALC-247 / prevent dropdown from showing when switching calcs with config … ([#281](https://github.com/igusdev/icalc/issues/281)) ([c312103](https://github.com/igusdev/icalc/commit/c3121039dec3554033a26b94a4ce4481f5cfb0fa))
- ICALC-247 / set related mat904 items in config search via additional calcul… ([#268](https://github.com/igusdev/icalc/issues/268)) ([68382b7](https://github.com/igusdev/icalc/commit/68382b756eefd26fa7bd3d4e24b3598dc898cdf3))

# [1.5.0](https://github.com/igusdev/icalc/compare/v1.4.0...v1.5.0) (2023-02-03)

### Bug Fixes

- add array fallbacks ([#243](https://github.com/igusdev/icalc/issues/243)) ([057a6c1](https://github.com/igusdev/icalc/commit/057a6c18d60bcf6594c72e096174d23efd9e5a1d))

# [1.4.0](https://github.com/igusdev/icalc/compare/v1.3.0...v1.4.0) (2022-12-20)

### Features

- fix label copy ([#234](https://github.com/igusdev/icalc/issues/234)) ([8cd8438](https://github.com/igusdev/icalc/commit/8cd8438edc794abc4dee2699ea5f77c8e41ad868))
- Item list name corrected ([#238](https://github.com/igusdev/icalc/issues/238)) ([7b3a413](https://github.com/igusdev/icalc/commit/7b3a413ebd32608d3d0558c529e50ec670df0068))
- Mat017 pinassignment fixed ([#235](https://github.com/igusdev/icalc/issues/235)) ([7b1bfe9](https://github.com/igusdev/icalc/commit/7b1bfe9b7be5e06e9b26d2d8f82b95f8f80ef902))
- switchmap used ([#233](https://github.com/igusdev/icalc/issues/233)) ([abac355](https://github.com/igusdev/icalc/commit/abac3556809d0a95b6613e03005ca4ba7bd6a797))

# [1.3.0](https://github.com/igusdev/icalc/compare/v1.2.0...v1.3.0) (2022-12-12)

### Bug Fixes

- :bug: add missing button to create new calc with new config in step1 ([#230](https://github.com/igusdev/icalc/issues/230)) ([28f3eb2](https://github.com/igusdev/icalc/commit/28f3eb2de6648d426379e95961e06fa7bf6725f2))

# [1.2.0](https://github.com/igusdev/icalc/compare/v1.1.0...v1.2.0) (2022-11-25)

### Features

- comments deleted due to merge conflicts ([ed2a142](https://github.com/igusdev/icalc/commit/ed2a142ffdcf11c521b7ac539d5d38f84ee73de0))
- file saver integration finished ([#224](https://github.com/igusdev/icalc/issues/224)) ([1513643](https://github.com/igusdev/icalc/commit/1513643156a03e7b9bd8b060e3a08bc5dde91701))
- Menu item inside the configurations added ([#225](https://github.com/igusdev/icalc/issues/225)) ([ee4b0d6](https://github.com/igusdev/icalc/commit/ee4b0d6f6912be4b5a9145feddecf749c9f6e86c))
- url problem on integration ([47ca101](https://github.com/igusdev/icalc/commit/47ca101dada63f9f63e7566dd12fdd5a1fd6c613))
- wrong environment file imported ([b4ee66a](https://github.com/igusdev/icalc/commit/b4ee66afc30a7d0b026aae0087a73a1663bdb760))

# [1.1.0](https://github.com/igusdev/icalc/compare/v1.0.0...v1.1.0) (2022-11-16)

### Features

- :sparkles: rename cut off for shields and add functions ([#210](https://github.com/igusdev/icalc/issues/210)) ([214935c](https://github.com/igusdev/icalc/commit/214935c5ea72770df9c61e579343c8c879bcca73))
- adjust structure of chainflex info in step 3 and 4 ([#217](https://github.com/igusdev/icalc/issues/217)) ([552327a](https://github.com/igusdev/icalc/commit/552327a14b5c1c5d0548de60e35255d09549f948))

## [1.0.1](https://github.com/igusdev/icalc/compare/v1.0.0...v1.0.1) (2022-11-03)

### Bug Fixes

- :bug: add more time to banner and change text ([4978097](https://github.com/igusdev/icalc/commit/497809752f637d5cfc9668d7a3b50b40879ce80a))
- :bug: save manual inserted workstepvalues permanently ([6c0cc9e](https://github.com/igusdev/icalc/commit/6c0cc9ef71b44efecc2e324bbb4ae3c047adbab1))
- :bug: wrong method call ([a070f85](https://github.com/igusdev/icalc/commit/a070f85af9065e16a1650ee84218665e88fa502a))
- automated tests, ICALC-114 ([2398d34](https://github.com/igusdev/icalc/commit/2398d34c7d35ea5277385d85c9dc1593ebb3ee9b))
- snackbar conditions, ICALC-114 ([e1a237f](https://github.com/igusdev/icalc/commit/e1a237f890601ce0c10968a3bf9bc4a4db2bb5ea))

# [1.0.0](https://github.com/igusdev/icalc/compare/v0.13.4...v1.0.0) (2022-11-02)

### Bug Fixes

- automated tests ([73b9629](https://github.com/igusdev/icalc/commit/73b96298a338722c00216cc459ad762a913e737d))

## [0.13.3](https://github.com/igusdev/icalc/compare/v0.13.2...v0.13.3) (2022-11-01)

**Note:** Version bump only for package @igus/icalc-calculator

## [0.13.2](https://github.com/igusdev/icalc/compare/v0.13.0...v0.13.2) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-calculator

## [0.13.1](https://github.com/igusdev/icalc/compare/v0.13.0...v0.13.1) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-calculator

# [0.13.0](https://github.com/igusdev/icalc/compare/v0.12.10...v0.13.0) (2022-10-27)

### Features

- remove dynamic chainflex length text ([#187](https://github.com/igusdev/icalc/issues/187)) ([b91f7d1](https://github.com/igusdev/icalc/commit/b91f7d1cf079e7ae69200727f7364e14cc7f671c))

## [0.12.10](https://github.com/igusdev/icalc/compare/v0.12.9...v0.12.10) (2022-10-27)

**Note:** Version bump only for package @igus/icalc-calculator

## [0.12.9](https://github.com/igusdev/icalc/compare/v0.12.8...v0.12.9) (2022-10-26)

**Note:** Version bump only for package @igus/icalc-calculator

## [0.12.8](https://github.com/igusdev/icalc/compare/v0.9.0...v0.12.8) (2022-10-25)

### Bug Fixes

- unset overflow for filter expansion panel ([#181](https://github.com/igusdev/icalc/issues/181)) ([a463612](https://github.com/igusdev/icalc/commit/a463612d8f5d0121805881a574be9bff1002f255))

### Features

- icalc 141/data adjustments ([#184](https://github.com/igusdev/icalc/issues/184)) ([dd7908b](https://github.com/igusdev/icalc/commit/dd7908ba7f7f103ce42ce5cd801138431a8e5173))
- icalc 29/pin assignment rules ([#180](https://github.com/igusdev/icalc/issues/180)) ([15743c8](https://github.com/igusdev/icalc/commit/15743c8572392585cd634f5002e1ee88fe6366e8))

# [0.9.0](https://github.com/igusdev/icalc/compare/v0.8.0...v0.9.0) (2022-10-14)

### Bug Fixes

- :bug: reset the calculation when loading a saved mat904 ([#174](https://github.com/igusdev/icalc/issues/174)) ([1760216](https://github.com/igusdev/icalc/commit/17602165e92b9077b1084cc0f4410f5d3b904f5d))

### Features

- default quantities for old records ([8f65c68](https://github.com/igusdev/icalc/commit/8f65c682cbd21c4eb97cd00ec8a422294c365123))
- fix for the type problem on calculation ([6e5b199](https://github.com/igusdev/icalc/commit/6e5b199ae6344239b8902a58bf15268b8c84454e))
- fixing failed tests ([4c53a53](https://github.com/igusdev/icalc/commit/4c53a53f70f185117e029e0d5013e1098dac5b18))
- icalc 113 / pin assignment (previously: line configuration) ([#171](https://github.com/igusdev/icalc/issues/171)) ([d4cf123](https://github.com/igusdev/icalc/commit/d4cf12330692f518dcb6a2565cea3e73147c139c))
- icalc 46/ Favorites (prefill configurations) ([#173](https://github.com/igusdev/icalc/issues/173)) ([28af0d1](https://github.com/igusdev/icalc/commit/28af0d114f09ffb6a752d9876666a6d1bd4136d3))
- quantities integration fix ([cefae76](https://github.com/igusdev/icalc/commit/cefae768c9a8ef4084cc9d547ae45d556a94fc6d))
- style budget changed ([b366bb2](https://github.com/igusdev/icalc/commit/b366bb230ba0569ed484ea3547ecab93f932872c))
- tests fixed ([83286ab](https://github.com/igusdev/icalc/commit/83286ab0ac4bd119ea383b0f69491361bf59b65a))
- tests fixed, keine greyed out. left connector is optional ([#177](https://github.com/igusdev/icalc/issues/177)) ([0a5e361](https://github.com/igusdev/icalc/commit/0a5e3617def63d43435c5e22825731be79a9030e))

# [0.8.0](https://github.com/igusdev/icalc/compare/v0.7.0...v0.8.0) (2022-09-22)

### Bug Fixes

- :bug: display correct unit prices ([#152](https://github.com/igusdev/icalc/issues/152)) ([e1e4ad9](https://github.com/igusdev/icalc/commit/e1e4ad9c50f5629a4d7d18bbcd22b9c8d3ad57c2))

### Features

- :sparkles: add additional fields to where clause, adjust wordin… ([#150](https://github.com/igusdev/icalc/issues/150)) ([1e3a042](https://github.com/igusdev/icalc/commit/1e3a04292f1b633f20cdcab4d949a16cbb566b2e))
- icalc 113/line configurator poc ([#162](https://github.com/igusdev/icalc/issues/162)) ([0e185e0](https://github.com/igusdev/icalc/commit/0e185e0a0365269a94637e4a6ff43bc4fde5875b))
- image creation bug fixed for excel mat-plans ([fb0be6e](https://github.com/igusdev/icalc/commit/fb0be6ea4f6dc47c948b222dc61b01288640210d))
- prepare PR to drop https listeners ([#165](https://github.com/igusdev/icalc/issues/165)) ([2a33d11](https://github.com/igusdev/icalc/commit/2a33d11dd8e872053d3d0bdae80fda605507d0c0))

# [0.7.0](https://github.com/igusdev/icalc/compare/v0.6.0...v0.7.0) (2022-08-24)

**Note:** Version bump only for package @igus/icalc-calculator

# [0.6.0](https://github.com/igusdev/icalc/compare/v0.5.0...v0.6.0) (2022-08-23)

### Bug Fixes

- :ambulance: always display widen upload icons ([#140](https://github.com/igusdev/icalc/issues/140)) ([dd2622b](https://github.com/igusdev/icalc/commit/dd2622bacbb79bf171ddfaa65d6f3134f747e01c))
- no negative values in MAT017 quantity input, remove itemCount, center copy connector button, ICALC-74 ([#127](https://github.com/igusdev/icalc/issues/127)) ([882faff](https://github.com/igusdev/icalc/commit/882faff513366f62389fe29cd9fff7e6e3b2ab11))

### Features

- :sparkles: add factored total price to calc result, display on … ([#144](https://github.com/igusdev/icalc/issues/144)) ([c0343c7](https://github.com/igusdev/icalc/commit/c0343c7d7591408a5da5827245cfba829069565d))
- add pipe to convert price format, implement pipe ([#128](https://github.com/igusdev/icalc/issues/128)) ([59a0c8c](https://github.com/igusdev/icalc/commit/59a0c8c6c4d6b9812f4bae2bfa4239aeaf46c214))
- adjust buttons on mat cards for connector items ([#137](https://github.com/igusdev/icalc/issues/137)) ([ab6a6e5](https://github.com/igusdev/icalc/commit/ab6a6e5ca17e53b7104c1c0c341b92017a6b806c))
- calculation of unit amout ([#143](https://github.com/igusdev/icalc/issues/143)) ([588f059](https://github.com/igusdev/icalc/commit/588f059f10f39f6dca600e8b20ebb213b4be31ef))
- connector tests fixed on main ([515f03e](https://github.com/igusdev/icalc/commit/515f03e442cf3398106f3bed13fbf84bf50dc290))
- icalc 27/calculation step ([#132](https://github.com/igusdev/icalc/issues/132)) ([601e912](https://github.com/igusdev/icalc/commit/601e9125b6376892f90f4b0dad516f196e662519))
- icalc 63/sketch part 2 ([#139](https://github.com/igusdev/icalc/issues/139)) ([bff9440](https://github.com/igusdev/icalc/commit/bff9440e2987d7baad27de505cbac8c615905345))
- shrink appearance of mat cards (smaller font, icons instead of texts, spacing) ([#133](https://github.com/igusdev/icalc/issues/133)) ([c3710a9](https://github.com/igusdev/icalc/commit/c3710a96caf0b1c79e2e1ab337124dd78a7e19e9))

# [0.5.0](https://github.com/igusdev/icalc/compare/v0.4.0...v0.5.0) (2022-08-01)

**Note:** Version bump only for package @igus/icalc-calculator

# [0.4.0](https://github.com/igusdev/icalc/compare/v0.3.0...v0.4.0) (2022-08-01)

**Note:** Version bump only for package @igus/icalc-calculator

# [0.3.0](https://github.com/igusdev/icalc/compare/v0.2.5...v0.3.0) (2022-07-29)

**Note:** Version bump only for package @igus/icalc-calculator

## [0.2.5](https://github.com/igusdev/icalc/compare/v0.2.4...v0.2.5) (2022-07-29)

**Note:** Version bump only for package @igus/icalc-calculator

## [0.2.1](https://github.com/igusdev/icalc/compare/v0.2.0...v0.2.1) (2022-07-27)

**Note:** Version bump only for package @igus/icalc-calculator

# [0.2.0](https://github.com/igusdev/icalc/compare/v0.1.0...v0.2.0) (2022-07-22)

### Bug Fixes

- :ambulance: temp fix for mock usage on integration ([e595f08](https://github.com/igusdev/icalc/commit/e595f085fd3ae48fdf0a5ec0062a2fef8e0ffb28))
- :bug: line-configurator unit test solved ICALC-25 ([#69](https://github.com/igusdev/icalc/issues/69)) ([057440f](https://github.com/igusdev/icalc/commit/057440f4566f119afd864987375df42eac254da2))
- add Observable mocks ([fd0d1e1](https://github.com/igusdev/icalc/commit/fd0d1e1d321216fc9527dfd780fbbf191bc636d6))
- adjust admin & 404 tests ([6747a32](https://github.com/igusdev/icalc/commit/6747a329b6c4befbc7f515e4ab9d764ef76f985b))
- adjust order of second level options ([#88](https://github.com/igusdev/icalc/issues/88)) ([064a3aa](https://github.com/igusdev/icalc/commit/064a3aacb9408d201553acaf83e8168f375cc5d1))
- adjust unit tests for left & right connector ([b72e41e](https://github.com/igusdev/icalc/commit/b72e41ec55e2326a51cd259a8768632fcf6e6066))
- failing unit tests ([a5aa629](https://github.com/igusdev/icalc/commit/a5aa629814cafa5ecf65151f2b067f8631a60854))
- library units tests ([0a8a0bf](https://github.com/igusdev/icalc/commit/0a8a0bf272c6ef478de8184692ba88267b115620))
- PR Connector custom sort icons iCalc-72 ([#75](https://github.com/igusdev/icalc/issues/75)) ([dc55e63](https://github.com/igusdev/icalc/commit/dc55e63ac2ab363899dde7f40efe43bbafcca847))
- PR feature/icalc-23/right-connector-finish ICALC-23 ([#30](https://github.com/igusdev/icalc/issues/30)) ([4f53327](https://github.com/igusdev/icalc/commit/4f53327b1275d41136d02cac53b9cd8ea0dbc6a7))
- PR feature/icalc-23/translation-module-test ICALC-23 ([#31](https://github.com/igusdev/icalc/issues/31)) ([b39cd43](https://github.com/igusdev/icalc/commit/b39cd43bf091ce51cdd4dd79f4e1dbdd70be20fc))
- unit test ([fc3d672](https://github.com/igusdev/icalc/commit/fc3d67235190a8b82c1ad845106c93c1afa317ff))
- update unit tests ([34c5f85](https://github.com/igusdev/icalc/commit/34c5f853b643f2f6fe58f48e6c2c68c8b417bfa8))

### Features

- ICALC-50 implement stepper functions ([1ebd94f](https://github.com/igusdev/icalc/commit/1ebd94f0a7b743dc02eb2b1f436e03b010309ef9))
- :bug: add a minimum requirement ([#89](https://github.com/igusdev/icalc/issues/89)) ([a575345](https://github.com/igusdev/icalc/commit/a5753457028b7898cbeaa8c064ecfe53584d3308))
- :fire: first version of the results page (only html placeholders) ([#25](https://github.com/igusdev/icalc/issues/25)) ([fe5b5ef](https://github.com/igusdev/icalc/commit/fe5b5ef6fb3b1c3da56da256ba794f0f062d8d16))
- :sparkles: code cleanup and loading state for: connector ([#32](https://github.com/igusdev/icalc/issues/32)) ([6f0aa41](https://github.com/igusdev/icalc/commit/6f0aa41febfa4e6e2927fbd84e7efa3ff039cfd4))
- :zap: baseurl for integration added into the calculators environment file ([da8d6ba](https://github.com/igusdev/icalc/commit/da8d6ba50e8f5546ecec358ad4b1f06211bd2dba))
- add components to stepbar ([#11](https://github.com/igusdev/icalc/issues/11)) ([6641e40](https://github.com/igusdev/icalc/commit/6641e4095148a70e742a894b19dbaa4217f2de81))
- add data from state ([6d1a004](https://github.com/igusdev/icalc/commit/6d1a004208b6d7218a621d18aa7eadb3019d6990))
- add footer ([#12](https://github.com/igusdev/icalc/issues/12)) ([a3ccdfb](https://github.com/igusdev/icalc/commit/a3ccdfba6303350e0ec4cc46bf70e8729ebebc55))
- add line-configurator state, save base64-encoded image and add to excel export ([b2013c8](https://github.com/igusdev/icalc/commit/b2013c88bcf59ddef79822a715a0beacd78aad10))
- add supplierItemNumber to filter for mockData, adjust prompt ([#47](https://github.com/igusdev/icalc/issues/47)) ([eef8d39](https://github.com/igusdev/icalc/commit/eef8d39e8ee211d4d1929773ef2b8737d4c226b8))
- adjust dropdown, split cut off and strip ([#87](https://github.com/igusdev/icalc/issues/87)) ([65dcc00](https://github.com/igusdev/icalc/commit/65dcc005b879a8b888f90338be948e17f8fdd620))
- chainflex environment variable issue fixed ([bef8c7d](https://github.com/igusdev/icalc/commit/bef8c7d304e303c2d6d922e620cdf2efcaf3a76b))
- csv files which hold the data from AX are used by postgres [ICALC-96] ([76942b4](https://github.com/igusdev/icalc/commit/76942b4e5511b7b667a4756e3d14a946f633d946))
- Feature/icalc 75/chainflex table sorting ICALC-75 ([b3ea271](https://github.com/igusdev/icalc/commit/b3ea2712f750fe3d14bd59c45d0ee8381cb3f3eb))
- feature/icalc-37/widen test image ICALC-37 ([d470c22](https://github.com/igusdev/icalc/commit/d470c22c0fbdee3465aab354647b40be5fbc3138))
- feature/icalc-86/batchsize merge main with ICALC-86 ([5c26216](https://github.com/igusdev/icalc/commit/5c26216c4133e7ee218ec6425781b85660660f8c))
- feature/icalc-86/checkbatchnumber ICALC-86 ([24fdc75](https://github.com/igusdev/icalc/commit/24fdc7538c2eb398e81db250c8d42f01d6038da2))
- first serverside excel download finished ([ef1a336](https://github.com/igusdev/icalc/commit/ef1a336c75aa2440b928fd19d239588f2534fa5c))
- formly trasnlatable validation messages implemented ([#35](https://github.com/igusdev/icalc/issues/35)) ([8c4d540](https://github.com/igusdev/icalc/commit/8c4d540295f01ef2af3b6f15b14b7e13c99abb3e))
- general improvements: footer flex design, metadata save and load from state, admin and 404 pages content. ([#23](https://github.com/igusdev/icalc/issues/23)) ([b9225e0](https://github.com/igusdev/icalc/commit/b9225e057bdd7a7d80fe6b16140c88f255a27a65))
- icalc 66/line configurator enhanced UI ([#34](https://github.com/igusdev/icalc/issues/34)) ([2db4743](https://github.com/igusdev/icalc/commit/2db47435ded067020f853debd0a398f0de67862c))
- icalc 67/adjust chainflex backend ([#115](https://github.com/igusdev/icalc/issues/115)) ([f70b0b3](https://github.com/igusdev/icalc/commit/f70b0b3ca04362d88fdf45329bdb4585faf704b0))
- icalc 72 sort coneector tables merge ICALC-72 ([#61](https://github.com/igusdev/icalc/issues/61)) ([f3886b0](https://github.com/igusdev/icalc/commit/f3886b035c8f70cd6685f992f1d7f8c3cf0776f7))
- icalc 80/show data ([#105](https://github.com/igusdev/icalc/issues/105)) ([620a59e](https://github.com/igusdev/icalc/commit/620a59ead76eea249137051bedfd563a3a3efa81))
- icalc 81/show connector data ([#111](https://github.com/igusdev/icalc/issues/111)) ([f1a771a](https://github.com/igusdev/icalc/commit/f1a771a3283c5817e55affd11f937022a9347dbe))
- icalc-49, 404 and admin basics, stepper translation ([#17](https://github.com/igusdev/icalc/issues/17)) ([90d2ffb](https://github.com/igusdev/icalc/commit/90d2ffb5d49a2e19b3670fbbedfb62c0edc90928))
- icalc-69/chainflex-v2 ([#86](https://github.com/igusdev/icalc/issues/86)) ([fe1cb24](https://github.com/igusdev/icalc/commit/fe1cb2498a9415fe2638c782c4bfea199b8089ee))
- implement chainflex basic UI ([#22](https://github.com/igusdev/icalc/issues/22)) ([69647ac](https://github.com/igusdev/icalc/commit/69647acdc7f70618e07491e8f4e948c07fa48b93))
- implement dummy chainflex graphics ([#33](https://github.com/igusdev/icalc/issues/33)) ([3b560d9](https://github.com/igusdev/icalc/commit/3b560d95cd8c1bf51d02e1f47cd3d9d1c1aa061c))
- left connector finished ICALC-22 ([#27](https://github.com/igusdev/icalc/issues/27)) ([c1576b5](https://github.com/igusdev/icalc/commit/c1576b5a60d225b969b3c9b231f42fa2fe78a9e0))
- lint errors fixed for the pipeline ([a644048](https://github.com/igusdev/icalc/commit/a6440484bf8c691e7d3993e05e676534a6be289a))
- nx migration done ([#52](https://github.com/igusdev/icalc/issues/52)) ([e1dd038](https://github.com/igusdev/icalc/commit/e1dd0385bda23a94bb1112de59fa039977e6a3ba))
- PR feature/icalc-25/pin-assignment ICALC-25 ([#66](https://github.com/igusdev/icalc/issues/66)) ([091e123](https://github.com/igusdev/icalc/commit/091e1237f38031871497f356cd862e00e742d8fb))
- PR right connector ICALC-23 ([#28](https://github.com/igusdev/icalc/issues/28)) ([d922604](https://github.com/igusdev/icalc/commit/d9226041ca366237e0f51aaa33d4c7d7be3c0c56))
- save base64-encoded snapshot of library to state and add it to excel export, ICALC-84 ([08eaf4c](https://github.com/igusdev/icalc/commit/08eaf4c6af90a57e853b31ea338ec9d6a1e4f792))
- setup excel export of result, ICALC-84 ([d203755](https://github.com/igusdev/icalc/commit/d203755fef9f808fc86fab0ad1602af2fc0c911d))
- small adjustments on library component ([#80](https://github.com/igusdev/icalc/issues/80)) ([6fc2160](https://github.com/igusdev/icalc/commit/6fc2160403b786a940824b35f18190391793a1a9))
- startoffset function to determine card placement ([#90](https://github.com/igusdev/icalc/issues/90)) ([b3dc11b](https://github.com/igusdev/icalc/commit/b3dc11bde59f44b287513aa1e7ca9331b0674d60))
- tesing the env variable on integration ([aaa7be9](https://github.com/igusdev/icalc/commit/aaa7be9b00c75c34c0e9088092ae0332b1a37723))
- testing errors fixed ([f1446cb](https://github.com/igusdev/icalc/commit/f1446cb37d8332487502398f707b40790c1a3969))

# [0.1.0](https://github.com/igusdev/icalc/compare/v0.0.4...v0.1.0) (2022-03-16)

**Note:** Version bump only for package @igus/icalc-calculator

## [0.0.4](https://github.com/igusdev/icalc/compare/v0.0.2...v0.0.4) (2022-03-16)

**Note:** Version bump only for package @igus/icalc-calculator

**Note:** Version bump only for package @igus/icalc-calculator

## 0.0.2 (2022-03-14)

### Bug Fixes

- adjust configs ([#2](https://github.com/igusdev/icalc/issues/2)) ([8302fe8](https://github.com/igusdev/icalc/commit/8302fe856a01541873dc9b7dcf53651d3021936a))
- **app:** update tests ([ae0c2ad](https://github.com/igusdev/icalc/commit/ae0c2adb1351c7be5a0117db6700796d08f3110e))
- remove last gears references ([0d0a0f6](https://github.com/igusdev/icalc/commit/0d0a0f619faf37c443277343de6ecc251f61cbc8))