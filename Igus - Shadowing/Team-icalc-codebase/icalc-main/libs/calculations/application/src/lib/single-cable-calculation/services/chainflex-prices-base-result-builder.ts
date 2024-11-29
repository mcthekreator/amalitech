import { ObjectUtils } from '@igus/icalc-utils';

export abstract class ChainflexPricesBaseResultBuilder<T> {
  protected result: T;

  public getResult(): T {
    return ObjectUtils.cloneDeep<T>(this.result);
  }
}
