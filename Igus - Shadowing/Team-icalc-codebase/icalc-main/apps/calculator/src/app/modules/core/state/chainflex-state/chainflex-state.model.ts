import type {
  ChainflexCable,
  IcalcListInformation,
  SingleCableCalculationPriceUpdateReference,
} from '@igus/icalc-domain';

export interface ChainflexStateModel {
  items: ChainflexCable[];
  totalCount: number;
  isLoading: boolean;
  chainflexPricesHaveChanged: boolean;
  chainflexesAndPricesAvailable: boolean;
  priceUpdateReference: SingleCableCalculationPriceUpdateReference;
  noItemsFound: boolean;
  error: string;
  chainflexCable: ChainflexCable;
  listInformation: IcalcListInformation;
}
