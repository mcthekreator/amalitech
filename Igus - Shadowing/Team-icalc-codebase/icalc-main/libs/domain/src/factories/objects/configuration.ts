import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import { UserMapper, getWorkStepDefaultPrices, WorkStepSet } from '../../models';
import type {
  Configuration,
  ConfigurationPresentation,
  ConfigurationSnapshot,
  ConfigurationSnapshotData,
} from '../../models';
import { createIcalcUser, createTestUserFullName } from './icalc-user';
import { createConfigurationStatePresentation, createConfigurationState } from './configuration-states';
import { createConfigurationSnapshotConnectorState } from './test/connector-state';

const configuration: Configuration = {
  id: 'exampleConfigurationId',
  matNumber: 'exampleMatNumber',
  labelingLeft: 'left',
  labelingRight: 'right',
  description: 'example description',
  creationDate: new Date(),
  createdBy: createTestUserFullName(),
  modificationDate: new Date(),
  modifiedBy: createTestUserFullName(),
  partNumber: 'CF10.01.12',
  state: createConfigurationState(),
};

/**
 * createConfiguration creates a Configuration
 *
 * @param override pass any needed overrides for the requested Configuration
 * @returns Configuration
 */
export const createConfiguration = (override?: NestedPartial<Configuration>): Configuration => {
  return mergePartially.deep(configuration, override);
};

const configurationSnapshotData: ConfigurationSnapshotData = {
  id: 'exampleConfigurationId',
  matNumber: 'exampleMatNumber',
  labelingLeft: 'left',
  labelingRight: 'right',
  description: 'example description',
  creationDate: new Date(),
  createdBy: createTestUserFullName(),
  modificationDate: new Date(),
  modifiedBy: createTestUserFullName(),
  partNumber: 'CF10.01.12',
  state: createConfigurationState({
    connectorState: createConfigurationSnapshotConnectorState(),
  }),
};

/**
 * createConfigurationSnapshotData creates a ConfigurationSnapshotData
 *
 * @param override pass any needed overrides for the requested ConfigurationSnapshotData
 * @returns ConfigurationSnapshotData
 */
export const createConfigurationSnapshotData = (
  override?: NestedPartial<ConfigurationSnapshotData>
): ConfigurationSnapshotData => {
  return mergePartially.deep(configurationSnapshotData, override);
};

const configurationSnapshot = {
  id: 'exampleConfigurationId',
  isSnapshotOf: configuration.id,
  workStepPrices: getWorkStepDefaultPrices(WorkStepSet.standard),
  configurationMatNumber: 'exampleMatNumberSnapshot',
  configurationData: createConfigurationSnapshotData(),
  creationDate: new Date(),
  createdBy: UserMapper.toPublicUser(createIcalcUser()),
  modificationDate: new Date(),
  modifiedBy: UserMapper.toPublicUser(createIcalcUser()),
};

/**
 * createConfigurationSnapshot creates a ConfigurationSnapshot
 *
 * @param override pass any needed overrides for the requested ConfigurationSnapshot
 * @returns ConfigurationSnapshot
 */
export const createConfigurationSnapshot = (override?: Partial<ConfigurationSnapshot>): ConfigurationSnapshot => {
  return mergePartially.deep(configurationSnapshot, override);
};

const configurationPresentation: ConfigurationPresentation = {
  id: 'exampleConfigurationId',
  matNumber: 'exampleMatNumber',
  labelingLeft: 'left',
  labelingRight: 'right',
  description: 'example description',
  creationDate: new Date(),
  createdBy: createTestUserFullName(),
  modificationDate: new Date(),
  modifiedBy: createTestUserFullName(),
  partNumber: 'CF10.01.12',
  state: createConfigurationStatePresentation(),
  singleCableCalculations: [],
};

/**
 * createConfigurationPresentation creates a ConfigurationPresentation
 *
 * @param override pass any needed overrides for the requested ConfigurationPresentation
 * @returns ConfigurationPresentation
 */
export const createConfigurationPresentation = (
  override?: NestedPartial<ConfigurationPresentation>
): ConfigurationPresentation => {
  return mergePartially.deep(configurationPresentation, override);
};

const partialConfiguration = {
  matNumber: 'exampleMatNumber',
  labelingLeft: 'left label',
  labelingRight: 'right label',
  description: 'example description',
  partNumber: 'CF10.01.12',
  state: createConfigurationState(),
};

/**
 * createPartialConfiguration creates a Partial Configuration
 *
 * default:
 * - creates a partial Configuration object which contains basic data for test objects
 *
 * @param override pass any needed overrides for the requested Partial Configuration
 * @returns Partial Configuration
 */
export const createPartialConfiguration = (
  override?: NestedPartial<Partial<Configuration>>
): Partial<Configuration> => {
  return mergePartially.deep(partialConfiguration, override);
};
