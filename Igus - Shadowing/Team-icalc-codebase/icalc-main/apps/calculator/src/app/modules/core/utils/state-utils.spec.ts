import { patchEntity, appendUniq, addEntity } from './state-utils';
import type { EntityStateModel } from '../state/process-state/process-state.model';

describe('state-utils', () => {
  describe('appendUniq', () => {
    it('should return existing array if items are not provided', () => {
      const result = appendUniq<number>(undefined)([1, 2, 3]);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should append unique items to the existing array', () => {
      const result = appendUniq<number>([4, 5])([1, 2, 3]);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should not append duplicates', () => {
      const result = appendUniq<number>([1, 2, 4, 5])([1, 2, 3]);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('addEntity', () => {
    it('should add entity to EntityStateModel', () => {
      const entity = { id: 'uuid1', name: 'Test' };

      const stateOperator = addEntity(entity);
      const initialState: EntityStateModel<typeof entity> = {
        items: {},
        ids: [],
      };

      const newState = stateOperator(initialState);

      // Assert the new state based on the expected behavior of the actual `patch` function.
      expect(newState.items[entity.id]).toEqual(entity);
      expect(newState.ids).toContain(entity.id);
    });
  });

  describe('patchEntity', () => {
    // Mock types for testing
    type TestEntity = {
      id: string;
      value?: string;
    };

    const initialState = {
      items: {
        uuid1: { id: 'uuid1', value: 'original' },
      },
      ids: ['uuid1'],
    };

    it('should update an existing entity if it exists', () => {
      const result = patchEntity<TestEntity>('uuid1', { value: 'updated' })(initialState);

      expect(result.items['uuid1']).toEqual({ id: 'uuid1', value: 'updated' });
    });

    it("should add a new entity if it doesn't exist", () => {
      const result = patchEntity<TestEntity>('uuid2', { id: 'uuid2', value: 'new' })(initialState);

      expect(result.items['uuid2']).toEqual({ id: 'uuid2', value: 'new' });
    });
  });
});
