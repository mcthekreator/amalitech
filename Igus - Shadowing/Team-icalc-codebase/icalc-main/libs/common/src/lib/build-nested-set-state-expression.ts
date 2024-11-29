import { type ConfigurationState } from '@igus/icalc-domain';

const buildJsonbSetExpressionRecursive = (
  state: Partial<ConfigurationState>,
  keys: string[],
  currentIndex: number
): string => {
  if (currentIndex >= keys.length) {
    return 'state'; // base case, return the original column name
  }

  const key = keys[currentIndex];
  const value = JSON.stringify(state[key]);

  const expression = `jsonb_set(${buildJsonbSetExpressionRecursive(
    state,
    keys,
    currentIndex + 1
  )}, '{${key}}', '${value}'::jsonb, true)`;

  return expression;
};

export const buildNestedSetStateExpression = (state: Partial<ConfigurationState>): string => {
  const stateKeys = Object.keys(state);

  return buildJsonbSetExpressionRecursive(state, stateKeys, 0);
};
