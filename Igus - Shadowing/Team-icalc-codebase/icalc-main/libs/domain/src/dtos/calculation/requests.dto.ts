import type {
  CustomerTypeEnum,
  Mat017ItemOverridesEnum,
  SingleCableCalculationBaseData,
  SingleCableCalculationPresentation,
} from '../../models';
import type { CreateConfigurationRequestDto } from '../configuration';

export interface CreateNewConfigurationForExistingCalculationRequestDto {
  calculationId: string;
  configuration: CreateConfigurationRequestDto;
  singleCableCalculation: SingleCableCalculationBaseData;
}

export interface CreateCalculationAndConfigurationRequestDto {
  calculation: CreateCalculationRequestDto;
  configuration: CreateConfigurationRequestDto;
  singleCableCalculation: SingleCableCalculationBaseData;
}

export interface AssignConfigurationItemsToCopiedCalculationRequestDto {
  singleCableCalculationIds: string[];
  newCalculationNumber: string;
  newQuoteNumber?: string;
  newCustomer?: string;
  createdBy: string;
  calculationId: string;
}

export interface CopyConfigurationToNewCalculationRequestDto extends CreateCalculationRequestDto {
  configurationId: string;
  newMatNumber: string;
  labelingLeft?: string;
  labelingRight?: string;
  description?: string;
  batchSize: number;
  chainflexLength: number;
  updatePrices: boolean;
}

export interface CreateCalculationRequestDto {
  calculationNumber: string;
  calculationFactor: number;
  quoteNumber?: string;
  customer?: string;
  customerType: CustomerTypeEnum;
  createdBy?: string;
  configurationMatNumbers?: string[];
}

export interface FindCalculationByCalculationNumberRequestDto {
  calculationNumber: string;
}

export interface FindCalculationByIdRequestDto {
  id: string;
}

export interface AssignConfigurationToExistingCalculationRequestDto {
  calculationId: string;
  configurationId: string;
  singleCableCalculationBaseData: SingleCableCalculationBaseData;
}

export interface CanLinkBetweenConfigurationAndCalculationBeRemovedRequestDto {
  singleCableCalculationId: string;
}

export interface RemoveLinkBetweenConfigurationAndCalculationRequestDto
  extends CanLinkBetweenConfigurationAndCalculationBeRemovedRequestDto {
  calculationId: string;
  configurationId: string;
}

export interface UpdateCalculationRequestDto {
  calculationNumber: string;
  calculationFactor?: number;
  quoteNumber?: string;
  customer?: string;
  customerType?: CustomerTypeEnum;
  mat017ItemRiskFactor?: number;
  mat017ItemAndWorkStepRiskFactor?: number;
  singleCableCalculation?: Partial<SingleCableCalculationPresentation>;
}

export interface SetExcelDownloadFlagsForCalculationRequestDto {
  calculationNumber: string;
  productionPlanExcelDownloaded?: boolean;
  calculationExcelDownloaded?: boolean;
}

export interface DuplicatingCalculationRequestDto {
  calculationId: string;
  newCalculationNumber: string;
  newQuoteNumber: string;
  newCustomer: string;
  singleCableCalculationIds: string[];
  createdBy: string;
}

export interface UpdateMat017OverridesRequestDto {
  calculationId: string;
  updateProperties: Mat017ItemOverridesEnum[];
  configurationIds: string[];
}
export interface ConfigurationWithMat017ItemsToBeRemoved {
  configurationId: string;
  mat017Items: string[];
}

export interface RemovedMat017ItemsRequestDto {
  calculationId: string;
  configurations: ConfigurationWithMat017ItemsToBeRemoved[];
}

export interface HaveMat017ItemsOverridesChangedRequestDto {
  configurationIds: string[];
}

export interface RemoveMat017ItemsConfiguration {
  configurationId: string;
  mat017Items: string[];
}

export interface RemoveMat017ItemsRequestDto {
  calculationId: string;
  configurations: RemoveMat017ItemsConfiguration[];
}
