import {
  icalcLockedTestCalculation,
  icalcTestCalculation,
  icalcTestCalculationWithManuallyCreatedItem,
  icalcTestCalculationWithManyAssignments,
  icalcTestCalculationWithMat017PinAssignment,
  icalcTestCalculationWithRemovedChainflex,
  icalcTestCalculationWithUpdatedChainflexPrice,
  icalcTestCalculationWithUpdatedMat017ItemPrice,
} from '@igus/icalc-domain';

export const externalUrls = {
  oribiLinkedIn: 'https://cdn.linkedin.oribi.io/partner/NULL/domain/localhost/token',
  koplaShopSession: 'https://services-kopla-integration.igusdev.igus.de/shop/session/new',
  igusPiwikContainer: 'https://igus.containers.piwik.pro',
  igusLocation: 'https://services-kopla-integration.igusdev.igus.de/location',
  widenContent: 'https://igus.widen.net/content',
};

export const apiEndpoints = {
  authSignIn: '/auth/signin',
  authProfile: '/auth/profile',
  authRefresh: '/auth/refresh',
  calculationFilter: '/calculation/filter',
  calculationFindByNumber: '/calculation/findByNumber',
  calculationFindById: '/calculation/findById',
  calculation: '/calculation',
  calculationSetExcelDownloadFlags: '/calculation/setExcelDownloadFlags',
  configurationFilter: '/configuration/filterConfiguration',
  configurationFindByMatNumber: '/configuration/findByNumber',
  createCalculationAndConfiguration: '/calculation/createCalculationAndConfiguration',
  assignConfigurationItemsToCopiedCalculation: '/calculation/assignConfigurationItemsToCopiedCalculation',
  copyConfigurationToExistingCalculation: '/calculation/copyConfigurationToExistingCalculation',
  copyConfigurationToNewCalculation: '/calculation/copyConfigurationToNewCalculation',
  assignConfigurationToExistingCalculation: '/calculation/assignConfigurationToExistingCalculation',
  createNewConfigurationForExistingCalculation: '/calculation/createNewConfigurationForExistingCalculation',
  removeLinkBetweenConfigurationAndCalculation: '/calculation/removeLinkBetweenConfigurationAndCalculation',
  haveMat017ItemsOverridesChanged: 'calculation/haveMat017ItemsOverridesChanged',
  removeMat017Items: '/calculation/removeMat017Items',
  updateMat017ItemsOverrides: '/calculation/updateMat017ItemsOverrides',
  chainflex: '/chainflex',
  favorites: '/favorites',
  singleCableCalculation: '/single-cable-calculation',
  saveSingleCableCalculation: '/single-cable-calculation/saveSingleCableCalculation',
  approveConfigurationStatus: '/single-cable-calculation/configuration/status/approve',
  checkChainflexAndPriceExistence: '/single-cable-calculation/checkChainflexAndPriceExistence',
  mat017Item: '/mat017-item',
  validatePinAssignment: '/process/validatePinAssignment',
  process: '/process',
  createExcelProductionPlanFile: '/process/createExcelProductionPlanFile',
  createExcelCalculationFile: '/process/createExcelCalculationFile',
  getMat017ItemsLatestModificationDate: '/mat017-item/latestModificationDate',
  getWidenData: '/mat017-item/images',
  uploadWidenImage: '/mat017-item/image',
};

export const buildUrl = (ressource: string): string => {
  return `${Cypress.env('apiUrl')}${ressource}`;
};

export const buildApiPath = (ressource: string): string => {
  return `api/${ressource}`;
};

export const byCy = (selector: string): string => `[dataCy="${selector}"]`;

export const selectors = {
  tab: '.mdc-tab',
  tableRow: '.mat-mdc-row',
  formlyValidationMessage: 'formly-validation-message',
  formField: '.mat-mdc-form-field',
  matOption: '.mat-mdc-option',
  matMenuItem: '.mat-mdc-menu-item',
  overlayContainer: '.cdk-overlay-container',
  transparentBackdrop: '.cdk-overlay-transparent-backdrop',
  icalcAssignConfigurationSearchDialog: 'icalc-assign-configuration-search-dialog',
  icalcAssignConfigurationDialog: 'icalc-assign-configuration-dialog',
  icalcRemoveLinkBetweenConfigurationAndCalculationDialog:
    'icalc-remove-link-between-configuration-and-calculation-dialog',
  step: '.kopla-stepper__step',
  checkboxInput: 'input[type="checkbox"]',
};

export enum Steps {
  metaData = 'meta-data',
  chainflex = 'chainflex',
  leftConnector = 'connector/left',
  rightConnector = 'connector/right',
  library = 'library',
  pinAssignment = 'pin-assignment',
  results = 'results',
}

export const staticStrings = {
  notAvailable: {
    de: 'nicht verfügbar',
    en: 'not available',
  },
  calcNumberTaken: {
    de: 'Kalkulationsnummer existiert bereits.',
    en: 'This Calculation number is taken.',
  },
  configNumberTaken: {
    de: 'Diese MAT-Nummer existiert bereits.',
    en: 'This MAT number is taken.',
  },
  betriebsMittler: {
    de: 'Betriebsmittler',
    en: 'Spot buy customer',
  },
  serialCustomer: {
    de: 'Serienkunde',
    en: 'Serial customer',
  },
  configurationWithChainflexLengthAndBatchSize: {
    de: `{{matNumber}} (CF-Länge: {{chainflexLength}}m; Losgröße: {{batchSize}})`,
    en: `{{matNumber}} (CF-length: {{chainflexLength}}m; Batch size: {{batchSize}})`,
  },
  chainflexLengthWithUnit: {
    de: `CF-Länge: {{chainflexLength}}m`,
    en: `CF-length: {{chainflexLength}}m`,
  },
  calculationFactor: {
    de: `Kalkulationsfaktor`,
    en: `Calculation factor`,
  },
  noResults: {
    de: `Ihre Suche ergab keine Ergebnisse`,
    en: `Your search did not return any results`,
  },
  labeling: {
    de: `Leitungsbeschriftung (rechts & links)`,
    en: `Labeling (right & left)`,
  },
  selectAll: {
    de: `Alle auswählen`,
    en: `Select all`,
  },
  editBridges: {
    de: 'Brücken editieren',
    en: 'Edit bridges',
  },
  saveBridges: {
    de: 'Editieren beenden',
    en: 'End editing',
  },
  connectAllShieldsOnHousing: {
    de: 'Alle Schirme ans Gehäuse',
    en: 'Connect all shields on housing',
  },
  placeOnJacket: {
    de: 'ans Gehäuse',
    en: 'Connect to housing',
  },
  setAllCoresOnContact: {
    de: 'Alle Adern an PIN legen',
    en: 'Set all cores on contact',
  },
  setOnContact: {
    de: 'an Pin legen',
    en: 'set on contact',
  },
  overrideInformationHeadline: {
    de: `Die Anzahl folgender Arbeitsschritte der {{matNumber}} wurden durch Änderungen in den vorherigen Schritten zurückgesetzt`,
    en: `Values for the following work steps of {{matNumber}} have been reset due to the changes in the previous steps:`,
  },
};

export const interpolateStringParameters = (template: string, interpolationParms: Record<string, string>): string => {
  return template.replace(/{{(\w+)}}/g, (_, key) => interpolationParms[key] || '');
};

export type ConfigurationTypes =
  | 'updated mat017 item prices'
  | 'updated chainflex price'
  | 'removed chainflex'
  | 'manually created mat017 items'
  | 'mat017 in pinAssignment';

export type CalculationTypes = 'basic' | 'locked' | 'many assignments';

export const mapAndCreateCalculationAndConfigurations = (
  selectedCalculation: CalculationTypes | ConfigurationTypes
): string => {
  switch (selectedCalculation) {
    case 'basic':
      cy.dbSeed('calculation-and-configuration');
      return icalcTestCalculation.calculationNumber;
    case 'locked':
      cy.dbSeed('calculation-and-configuration --locked');
      return icalcLockedTestCalculation.calculationNumber;
    case 'updated mat017 item prices':
      cy.dbSeed('calculation-and-configuration --updatedMat017ItemPrice');
      return icalcTestCalculationWithUpdatedMat017ItemPrice.calculationNumber;
    case 'many assignments':
      cy.dbSeed('calculation-and-configuration --manyAssignments');
      return icalcTestCalculationWithManyAssignments.calculationNumber;
    case 'updated chainflex price':
      cy.dbSeed('calculation-and-configuration --updatedChainflexPrice');
      return icalcTestCalculationWithUpdatedChainflexPrice.calculationNumber;
    case 'removed chainflex':
      cy.dbSeed('calculation-and-configuration --removedChainflex');
      return icalcTestCalculationWithRemovedChainflex.calculationNumber;
    case 'manually created mat017 items':
      cy.dbSeed('calculation-and-configuration --manuallyCreatedMat017Item');
      return icalcTestCalculationWithManuallyCreatedItem.calculationNumber;
    case 'mat017 in pinAssignment':
      cy.dbSeed('calculation-and-configuration --mat017PinAssignment');
      return icalcTestCalculationWithMat017PinAssignment.calculationNumber;
    default:
      throw Error('Calculation/Configuration not existent');
  }
};
