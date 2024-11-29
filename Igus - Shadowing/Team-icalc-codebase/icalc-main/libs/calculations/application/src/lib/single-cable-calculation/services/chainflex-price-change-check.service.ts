import { ChainflexDataAccessService } from '@igus/icalc-configurations-infrastructure';
import type { ChainflexCable, ChainflexPrice } from '@igus/icalc-domain';
import { Injectable } from '@nestjs/common';

export interface ChainflexPriceDeviationResult {
  chainflexPriceDeviationDetected: boolean;
  statePriceObject?: ChainflexPrice;
  currentPriceObject?: ChainflexPrice;
  priceAvailable?: boolean;
  cfCableProvided?: boolean;
}

@Injectable()
export class ChainflexPriceChangeCheckService {
  constructor(private readonly chainflexDataAccessService: ChainflexDataAccessService) {}

  public async deviationDetected(chainflexCable: ChainflexCable): Promise<ChainflexPriceDeviationResult> {
    if (!chainflexCable) {
      return {
        chainflexPriceDeviationDetected: false,
        cfCableProvided: false,
      };
    }

    const { partNumber, price: statePriceObject } = chainflexCable;

    const chainflex = await this.chainflexDataAccessService.findOneByPartNumber(partNumber);

    const currentPriceObject = chainflex?.price;

    if (!currentPriceObject) {
      return { chainflexPriceDeviationDetected: true, statePriceObject, currentPriceObject, priceAvailable: false };
    }

    const chainflexPriceDeviationDetected = statePriceObject.germanListPrice !== currentPriceObject.germanListPrice;

    return { chainflexPriceDeviationDetected, statePriceObject, currentPriceObject, priceAvailable: true };
  }
}
