import { ArrayUtils, ObjectUtils } from '@igus/icalc-utils';
import type { EntityStateModel, ProcessStateModel } from '../state/process-state/process-state.model';
import type { StateOperator } from '@ngxs/store';
import type { ExistingState, NoInfer, ɵPatchSpec } from '@ngxs/store/operators';
import { patch } from '@ngxs/store/operators';
import type { SingleCableCalculationPresentation } from '@igus/icalc-domain';
/*
 * Returns a function which allows access state default values in a safe way
 */
export const createGetDefaultStateItemValue = <T>(defaults: T) => {
  return <K extends keyof T>(key?: K): T[K] => {
    const item = defaults[key];

    if (Array.isArray(item)) {
      return [...item] as unknown as T[K];
    }

    if (item === null) {
      return null;
    }

    if (item === undefined) {
      return undefined;
    }

    if (typeof item === 'object') {
      return { ...item };
    }

    return item;
  };
};

export const appendUniq = <T>(items: T[]) => {
  return (existing: Readonly<T[]>): T[] => {
    // If `items` is `undefined` or `null` or `[]` but `existing` is provided
    // just return `existing`
    const itemsNotProvidedButExistingIs = (!items || !items.length) && existing;

    if (itemsNotProvidedButExistingIs) {
      return existing as T[];
    }

    if (Array.isArray(existing)) {
      // filter out duplications
      const uniq = items.filter((item) => !existing.includes(item));

      return uniq.length === 0 ? existing : existing.concat(uniq);
    }

    return items;
  };
};

export const addEntity = <T>(entity: T & { id?: string }): StateOperator<EntityStateModel<T>> => {
  if (!entity) {
    return patch<EntityStateModel<T>>({});
  }

  return patch<EntityStateModel<T>>({
    items: patch({ [entity.id]: entity }),
    ids: appendUniq([entity.id]),
  });
};

export const patchEntity = <T>(
  key: string,
  entity: NoInfer<ɵPatchSpec<T>> | StateOperator<T>
): StateOperator<EntityStateModel<T>> => {
  return (existingState: Readonly<EntityStateModel<T>>) => {
    if (!existingState) {
      existingState = { items: {}, ids: [] };
    }

    const clone: EntityStateModel<T> = { ...existingState };

    if (!clone.items) {
      clone.items = {};
    }

    // If there's already an entity with this key in the items
    if (existingState.items && existingState.items[key]) {
      let entityStateOperator: StateOperator<T>;

      // Check if the provided entity is a StateOperator or a PatchSpec
      if (entity instanceof Function) {
        entityStateOperator = entity;
      } else {
        entityStateOperator = patch(entity);
      }

      // Use the patch operator to update the specific entity
      clone.items[key] = entityStateOperator(existingState.items[key] as ExistingState<T>);
    } else {
      // If there's no existing entity, simply assign
      if (entity instanceof Function) {
        clone.items[key] = entity(undefined);
      } else {
        clone.items[key] = entity as T;
      }
    }

    return clone;
  };
};

// sorts from oldest to newest
export const sortByDateImmutable = <T>(collection: T[], sortBy: string): T[] => {
  return ObjectUtils.cloneDeep<T[]>(ArrayUtils.fallBackToEmptyArray<T>(collection)).sort(
    (a, b) => new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime()
  );
};

export const sortByCreationDate = <T extends { creationDate: Date }>(collection: T[]): T[] => {
  return sortByDateImmutable<T>(collection, 'creationDate');
};

export const sortByAssignmentDate = <T extends { assignmentDate: Date }>(collection: T[]): T[] => {
  return sortByDateImmutable<T>(collection, 'assignmentDate');
};

export const createMockProcessState = (
  stateOverrides: Partial<ProcessStateModel>,
  sccList: SingleCableCalculationPresentation[]
): Partial<ProcessStateModel> => {
  return {
    ...stateOverrides,
    entities: {
      singleCableCalculations: {
        items: {
          ...sccList.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
          }, {}),
        },
        ids: [...sccList.map((scc) => scc.id)],
      },
      configurations: {
        items: {
          ...sccList
            .map((scc) => scc.configuration)
            .reduce((acc, curr) => {
              acc[curr.id] = curr;
              return acc;
            }, {}),
        },
        ids: [...sccList.map((scc) => scc.configuration.id)],
      },
      calculations: {
        items: {
          ...sccList
            .map((scc) => scc.calculation)
            .reduce((acc, curr) => {
              acc[curr.id] = curr;
              return acc;
            }, {}),
        },
        ids: [...sccList.map((scc) => scc.calculation.id)],
      },
      snapshots: {
        items: {},
        ids: [],
      },
    },
  };
};
