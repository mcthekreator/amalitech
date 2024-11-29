import type { ConfigurationState, CustomerTypeEnum } from '../../models';

export interface FindConfigurationByMatNumberRequestDto {
  matNumber: string;
}

export class FindConfigurationByIdRequestDto {
  public id: string;
}

export interface SetCalculationConfigurationStatusToApprovedRequestDto {
  calculationId: string;
  configurationId: string;
}

export enum StepName {
  'chainflex' = 'chainflex',
  'connector' = 'connector',
  'library' = 'library',
  'pinAssignment' = 'pinAssignment',
}

export interface ChangeCheckRequestDto {
  configurationId: string;
  step: StepName;
  state: object;
}

export interface CreateConfigurationRequestDto {
  matNumber: string;
  labelingLeft?: string; // optional in DB therefore optional here
  labelingRight?: string; // optional in DB therefore optional here
  description?: string; // optional in DB therefore optional here
  batchSize?: number; // optional in DB therefore optional here
  partNumber?: string; // optional in DB therefore optional here
  state?: ConfigurationState;
}

export interface CopyConfigurationToExistingCalculationRequestDto {
  configurationId: string;
  newMatNumber: string;
  createdBy: string;
  calculationId: string;
  labelingLeft?: string;
  labelingRight?: string;
  description?: string;
  batchSize: number;
  chainflexLength: number;
  updatePrices?: boolean;
}

export interface CopyConfigurationToNewCalculationDto {
  calculationNumber: string;
  createdBy: string;
  calculationFactor: number;
  quoteNumber: string;
  customer: string;
  customerType: CustomerTypeEnum;
  configurationId: string;
  newMatNumber: string;
  labelingLeft: string;
  labelingRight: string;
  description: string;
  batchSize: number;
  chainflexLength: number;
  updatePrices: boolean;
}

export class FindCalculationConfigurationStatusByIdsRequestDto {
  public calculationId: string;
  public configurationId: string;
}
