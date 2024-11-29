import type { Configuration, ConfigurationState, ConfigurationStatePresentation } from '@igus/icalc-domain';
import {
  ConfigurationStateMapper,
  ObjectUtils,
  WorkStepSet,
  createConfiguration,
  createIcalcTestConnectorState,
  createIcalcTestRedactedMat017ItemWithWidenData,
  mat017ItemFieldsToOmit,
} from '@igus/icalc-domain';
import { StateChangeCheckService } from './state-change-check.service';

describe('StateChangeCheckService', () => {
  const stateChangeCheckService = new StateChangeCheckService();
  let oldConfig: Configuration;
  let newConfig: Configuration;

  beforeEach(() => {
    oldConfig = createConfiguration();

    oldConfig.state = ConfigurationStateMapper.removeMat017ItemBaseDataFromConnectorState(
      oldConfig.state as ConfigurationStatePresentation,
      mat017ItemFieldsToOmit
    );

    newConfig = ObjectUtils.cloneDeep<Configuration>(oldConfig);
  });

  describe('changeDetected', () => {
    it('should return false if no changes have been made', () => {
      newConfig.state = {
        connectorState: oldConfig.state.connectorState,
      } as ConfigurationState;

      const result = stateChangeCheckService.changeDetected(oldConfig, newConfig, newConfig.state);

      expect(result).toBe(false);
    });

    it('should return true if changes have been made in connectorState', () => {
      newConfig.state = {
        connectorState: createIcalcTestConnectorState({
          leftConnector: {
            mat017ItemListWithWidenData: [createIcalcTestRedactedMat017ItemWithWidenData({ id: 'newId' })],
          },
        }),
      } as ConfigurationState;

      const result = stateChangeCheckService.changeDetected(oldConfig, newConfig, newConfig.state);

      expect(result).toBe(true);
    });

    it('should return false if only widen image url changes have been made in connectorState', () => {
      oldConfig.state = {
        connectorState: createIcalcTestConnectorState({
          leftConnector: {
            mat017ItemListWithWidenData: [
              createIcalcTestRedactedMat017ItemWithWidenData({
                photoUrl: 'oldUrl1',
                techDrawUrl: 'oldUrl2',
                pinAssUrl: 'oldUrl3',
                photoVersionId: 'oldVersion1',
                techDrawVersionId: 'oldVersion2',
                pinAssVersionId: 'oldVersion3',
              }),
            ],
          },
        }),
      } as ConfigurationState;

      oldConfig.state = ConfigurationStateMapper.removeMat017ItemBaseDataFromConnectorState(
        oldConfig.state as ConfigurationStatePresentation,
        mat017ItemFieldsToOmit
      );

      newConfig.state = {
        connectorState: createIcalcTestConnectorState({
          leftConnector: {
            mat017ItemListWithWidenData: [
              createIcalcTestRedactedMat017ItemWithWidenData({
                photoUrl: 'newUrl1',
                techDrawUrl: 'newUrl2',
                pinAssUrl: 'newUrl3',
                photoVersionId: 'newVersion1',
                techDrawVersionId: 'newVersion2',
                pinAssVersionId: 'newVersion3',
              }),
            ],
          },
        }),
      } as ConfigurationState;

      const result = stateChangeCheckService.changeDetected(oldConfig, newConfig, newConfig.state);

      expect(result).toBe(false);
    });

    it('should return true if changes have been made to chainflexState, pinAssignmentState and workStepSet', () => {
      newConfig.state = {
        chainFlexState: {},
        pinAssignmentState: {},
        workStepSet: WorkStepSet.ethernet,
      } as ConfigurationState;

      const result = stateChangeCheckService.changeDetected(oldConfig, newConfig, newConfig.state);

      expect(result).toBe(true);
    });

    it('should return true if changes have been made to chainflexState, pinAssignmentState and workStepOverrides', () => {
      newConfig.state = {
        chainFlexState: {},
        pinAssignmentState: null,
        workStepOverrides: {},
      } as ConfigurationState;

      const result = stateChangeCheckService.changeDetected(oldConfig, newConfig, newConfig.state);

      expect(result).toBe(true);
    });

    it('should return true if changes have been made only to workStepOverrides', () => {
      newConfig.state = {
        workStepOverrides: {},
      } as ConfigurationState;

      const result = stateChangeCheckService.changeDetected(oldConfig, newConfig, newConfig.state);

      expect(result).toBe(true);
    });
  });
});
