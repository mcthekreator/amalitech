import { createMat017Item } from '@igus/icalc-domain';
import type { IcalcConnector } from './connector-state.model';
import { createMat017ItemWithWidenDataStatus } from './connector-state.model';

const mockMat017Item = { matNumber: 'MAT123' };

describe('createMat017ItemWithWidenDataStatus', () => {
  it('should return "left" when mat017Item is found in current connector mat017Item list and which is "leftConnector"', () => {
    const currentConnector = {
      mat017ItemListWithWidenData: [mockMat017Item],
    } as IcalcConnector;
    const mat017Item = createMat017Item(mockMat017Item);
    const which = 'leftConnector';

    const result = createMat017ItemWithWidenDataStatus(currentConnector, mat017Item, which);

    expect(result).toBe('left');
  });

  it('should return "right" when mat017Item is found in current connector mat017Item list and which is not "leftConnector"', () => {
    const currentConnector = {
      mat017ItemListWithWidenData: [mockMat017Item],
    } as IcalcConnector;
    const mat017Item = createMat017Item(mockMat017Item);
    const which = 'rightConnector';

    const result = createMat017ItemWithWidenDataStatus(currentConnector, mat017Item, which);

    expect(result).toBe('right');
  });

  it('should return an empty string when mat017Item is not found in current connector mat017Item list ', () => {
    const currentConnector = {
      mat017ItemListWithWidenData: [{ matNumber: 'MAT456' }],
    } as IcalcConnector;
    const mat017Item = createMat017Item(mockMat017Item);
    const which = 'leftConnector';

    const result = createMat017ItemWithWidenDataStatus(currentConnector, mat017Item, which);

    expect(result).toBe('');
  });

  it('should return an empty string when mat017ItemListWithWidenData is undefined in current connector', () => {
    const currentConnector = {
      mat017ItemListWithWidenData: undefined,
    } as IcalcConnector;
    const mat017Item = createMat017Item(mockMat017Item);
    const which = 'leftConnector';

    const result = createMat017ItemWithWidenDataStatus(currentConnector, mat017Item, which);

    expect(result).toBe('');
  });
});
