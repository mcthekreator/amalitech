import { ObjectUtils } from './object-utils';

describe('ObjectUtils', () => {
  describe('pickKeys', () => {
    it('should correctly pick some keys from an object', () => {
      const inputObj = {
        key1: 1,
        key2: 2,
        key3: 3,
      };

      const result = ObjectUtils.pickKeys(inputObj, ['key1', 'key3']);

      expect(result).toEqual({
        key1: 1,
        key3: 3,
      });
    });
  });

  describe('isTruthy', () => {
    it('should correctly identify truthy values', () => {
      expect(ObjectUtils.isTruthy(true)).toBeTruthy();
      expect(ObjectUtils.isTruthy({})).toBeTruthy();
      expect(ObjectUtils.isTruthy('t')).toBeTruthy();
    });

    it('should correctly identify non truthy values', () => {
      expect(ObjectUtils.isTruthy(false)).toBeFalsy();
      expect(ObjectUtils.isTruthy(0)).toBeFalsy();
      expect(ObjectUtils.isTruthy(undefined)).toBeFalsy();
    });
  });

  describe('hasKey', () => {
    it('should correctly identify if a key is present in a simple object', () => {
      const testObject = {
        firstKey: 'firstKeyvalue',
        secondKey: 'secondKeyValue',
        thirdKey: null,
      };

      delete testObject.thirdKey;

      expect(ObjectUtils.hasKey(testObject, 'firstKey')).toBeTruthy();
      expect(ObjectUtils.hasKey(testObject, 'thirdKey')).toBeFalsy();
    });

    it('should correctly identify if a key is present in a record', () => {
      const testRecord: Record<string, { firstObjectKey: string; secondObjectKey: string }> = {};

      testRecord['123'] = {
        firstObjectKey: 'firstKeyvalue',
        secondObjectKey: 'secondKeyValue',
      };
      testRecord['456'] = {
        firstObjectKey: 'firstKeyvalue',
        secondObjectKey: 'secondKeyValue',
      };

      expect(ObjectUtils.hasKey(testRecord, '123')).toBeTruthy();
      expect(ObjectUtils.hasKey(testRecord, '789')).toBeFalsy();
    });
  });
});
