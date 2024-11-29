import type { CalculationTypes, ConfigurationTypes } from '../utils';
import { mapAndCreateCalculationAndConfigurations, Steps } from '../utils';

import { Given } from '@badeball/cypress-cucumber-preprocessor';

type PageNames = keyof typeof Steps;
const mapPage = (selectedPage: PageNames): Steps => {
  switch (selectedPage.toLowerCase()) {
    case 'metadata':
      return Steps.metaData;
    case 'chainflex':
      return Steps.chainflex;
    case 'leftconnector':
      return Steps.leftConnector;
    case 'rightconnector':
      return Steps.rightConnector;
    case 'library':
      return Steps.library;
    case 'pinassignment':
      return Steps.pinAssignment;
    default:
      throw Error('page not existent');
  }
};

const selectPageAndCalculation = (
  selectedPage: PageNames,
  selectedCalculation: CalculationTypes | ConfigurationTypes
): void => {
  const page = mapPage(selectedPage);
  const calculationNumber = mapAndCreateCalculationAndConfigurations(selectedCalculation);

  cy.clickThroughToStep(calculationNumber, page);
};

Given(
  /^the user is on (metaData|chainflex|leftConnector|rightConnector|library|pinAssignment) page with a Configuration selected that has (updated mat017 item prices|updated chainflex price|removed chainflex|manually created mat017 items|mat017 in pinAssignment)$/,
  (selectedPage: PageNames, selectedConfiguration: CalculationTypes) => {
    selectPageAndCalculation(selectedPage, selectedConfiguration);
  }
);

Given(
  /^the user is on (metaData|chainflex|leftConnector|rightConnector|library|pinAssignment) page with a Calculation selected that (is|has) (basic|locked|many assignments)$/,
  (selectedPage: PageNames, _: 'is' | 'has', selectedCalculation: CalculationTypes) => {
    selectPageAndCalculation(selectedPage, selectedCalculation);
  }
);

Given(
  /^a configuration that has (updated mat017 item prices|updated chainflex price|removed chainflex|manually created mat017 items|mat017 in pinAssignment) was previously created$/,
  (selectedConfiguration: ConfigurationTypes) => mapAndCreateCalculationAndConfigurations(selectedConfiguration)
);

Given(
  /^a calculation that (is|has) (basic|locked|many assignments) was previously created$/,
  (_: 'is' | 'has', selectedCalculation: CalculationTypes) =>
    mapAndCreateCalculationAndConfigurations(selectedCalculation)
);
