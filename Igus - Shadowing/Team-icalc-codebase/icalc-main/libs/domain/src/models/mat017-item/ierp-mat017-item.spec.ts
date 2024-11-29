import { getDefaultPurchasingPrice } from '../../models';
import { createIerpMat017Item } from '../../factories/objects';

const mockIerpMat017Item = createIerpMat017Item();

describe('getDefaultPurchasingPrice', () => {
  it('should return the price object where quantityAmount is 0', () => {
    const expected = { quantityAmount: 0, amount: 2 };
    const result = getDefaultPurchasingPrice(mockIerpMat017Item);

    expect(result).toEqual(expect.objectContaining(expected));
  });

  it('should return undefined if there is no price with quantityAmount of 0', () => {
    const price = mockIerpMat017Item.prices[0];

    const mockItem = createIerpMat017Item({
      prices: [
        {
          ...price,
          quantityAmount: 100,
        },
      ],
    });

    const result = getDefaultPurchasingPrice(mockItem);

    expect(result).toBeUndefined();
  });

  it('should handle an empty prices array', () => {
    const mockItem = createIerpMat017Item({ prices: [] });

    const result = getDefaultPurchasingPrice(mockItem);

    expect(result).toBeUndefined();
  });
});
