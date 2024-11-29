import { calculateAmountDividedByPriceUnit, getPriceUnitFromCode, Mat017ItemMatNumber } from '@igus/icalc-domain';
import type { Mat017Item } from '@igus/icalc-domain';
import { Injectable } from '@nestjs/common';
import type { CreateMat017ItemManuallyDto } from '../dtos';

@Injectable()
export class Mat017RequestMappersService {
  public fromCreateMat017ItemRequest(items: CreateMat017ItemManuallyDto[]): Partial<Mat017Item>[] {
    return items.map((item: CreateMat017ItemManuallyDto) => this.mapToSingleMat017Item(item));
  }

  public mapToSingleMat017Item(item: CreateMat017ItemManuallyDto): Partial<Mat017Item> {
    const {
      matNumber,
      mat017ItemGroup,
      itemDescription1,
      itemDescription2,
      supplierItemNumber,
      amount,
      priceUnit, // S, M, H, T
    } = item;

    return {
      matNumber: this.getParsedMatNumber(matNumber),
      mat017ItemGroup,
      itemDescription1,
      itemDescription2,
      supplierItemNumber,
      amount,
      priceUnit: getPriceUnitFromCode(priceUnit),
      amountDividedByPriceUnit: calculateAmountDividedByPriceUnit(amount, priceUnit),
      manuallyCreated: true,
    };
  }

  public getParsedMatNumber(matNumber: string): string {
    return Mat017ItemMatNumber.create(matNumber).value;
  }
}
