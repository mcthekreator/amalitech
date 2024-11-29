import { removeChainflexRelatedOverrides } from './utils';

describe('removeChainflexRelatedOverrides', () => {
  it('should remove CF related override properties and keep non CF related properties from a given workStepOverrides object', async () => {
    const workStepOverrides = {
      consignment: 5,
      strip: 5,
      shieldHandling: 5,
      skinning: 5,
      crimp: 5,
      labeling: 5,
      drillingSealInsert: 5,
      test: 5,
      sendTestReport: 5,
      cutUnder20MM: 5,
      cutOver20MM: 5,
      testFieldPrep: 5,
      package: 5,
    };

    const result = removeChainflexRelatedOverrides(workStepOverrides);

    expect(result.consignment).toBe(5);
    expect(result.labeling).toBe(5);
    expect(result.drillingSealInsert).toBe(5);
    expect(result.sendTestReport).toBe(5);
    expect(result.testFieldPrep).toBe(5);
    expect(result.package).toBe(5);

    expect(result.strip).toBe(undefined);
    expect(result.shieldHandling).toBe(undefined);
    expect(result.skinning).toBe(undefined);
    expect(result.crimp).toBe(undefined);
    expect(result.test).toBe(undefined);
    expect(result.cutUnder20MM).toBe(undefined);
    expect(result.cutOver20MM).toBe(undefined);
  });

  it('should remove CF related override properties from a given workStepOverrides object', async () => {
    const workStepOverrides = {
      skinning: 5,
    };

    const result = removeChainflexRelatedOverrides(workStepOverrides);

    expect(result).toEqual({});
  });

  it('should keep non CF related properties from a given workStepOverrides object', async () => {
    const workStepOverrides = {
      consignment: 5,
      package: 5,
    };

    const result = removeChainflexRelatedOverrides(workStepOverrides);

    expect(result).toEqual(workStepOverrides);
  });

  it('should leave workStepOverrides object untouched if no CF related override properties are included', async () => {
    const workStepOverrides = {};

    const result = removeChainflexRelatedOverrides(workStepOverrides);

    expect(result).toEqual({});
  });
});
