import type { ConfigurationState } from '@igus/icalc-domain';
import { createConfigurationState } from '@igus/icalc-domain';
import { buildNestedSetStateExpression } from './build-nested-set-state-expression';

describe('buildNestedSetStateExpression', () => {
  const configurationState = createConfigurationState();

  test('should return original column name for empty state', () => {
    const state = {};

    expect(buildNestedSetStateExpression(state)).toBe('state');
  });

  test('should correctly build jsonb_set expression for one key', () => {
    const { chainFlexState } = configurationState;
    const state = { chainFlexState } as Partial<ConfigurationState>;

    const expected = `jsonb_set(state, '{chainFlexState}', '${JSON.stringify(chainFlexState)}'::jsonb, true)`;

    expect(buildNestedSetStateExpression(state)).toBe(expected);
  });

  test('should correctly build jsonb_set expression for many keys', () => {
    const { chainFlexState } = configurationState;
    const state = { chainFlexState, pinAssignmentState: null } as Partial<ConfigurationState>;

    const expected = `jsonb_set(jsonb_set(state, '{pinAssignmentState}', 'null'::jsonb, true), '{chainFlexState}', '${JSON.stringify(
      chainFlexState
    )}'::jsonb, true)`;

    expect(buildNestedSetStateExpression(state)).toBe(expected);
  });
});
