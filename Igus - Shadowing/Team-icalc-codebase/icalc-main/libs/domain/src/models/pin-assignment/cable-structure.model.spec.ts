/* eslint-disable @typescript-eslint/naming-convention */
import { FormControl, FormGroup } from '@angular/forms';
import type {
  ActionModels,
  Bridges,
  CableStructureItemList,
  Core,
  Litze,
  Shield,
  Twisting,
} from './cable-structure.model';
import {
  getNumberAndOrderOfSubactionsWithinTwist,
  getNumberOfSubactionsWithinShield,
  removeUnusedNewLinesFromActionModels,
} from './cable-structure.model';

import type { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

describe('getNumberOfSubactionsWithinShield', () => {
  it('should return 0 if shield has no lineOrder or shieldedItemCount is 0', () => {
    const item: Shield = {
      type: 'shield',
      lineOrder: null,
      shieldedItemCount: 0,
      description: 'Test Shield',
      horizontalOrder: 1,
    };

    const actionModels: ActionModels = {
      '0': { type: 'core', left: { actionSelect: 'none' }, right: { actionSelect: 'cutOff' } },
      '1': { type: 'shield', left: { actionSelect: 'cutOffAndSkin' }, right: { actionSelect: 'isolate' } },
    };

    const result = getNumberOfSubactionsWithinShield(item, actionModels);

    expect(result).toBe(0);
  });

  it('should return 0 if shieldedItemCount is 0', () => {
    const item: Shield = {
      type: 'shield',
      lineOrder: 6,
      shieldedItemCount: 0,
      description: 'Test Shield',
      horizontalOrder: 1,
    };

    const actionModels: ActionModels = {
      '6': { type: 'shield', left: { actionSelect: 'none' }, right: { actionSelect: 'cutOff' } },
    };

    const result = getNumberOfSubactionsWithinShield(item, actionModels);

    expect(result).toBe(0);
  });

  it('should return the correct number of subactions within shield range', () => {
    const item: Shield = {
      type: 'shield',
      lineOrder: 6,
      shieldedItemCount: 3,
      description: 'Test Shield',
      horizontalOrder: 1,
    };

    const actionModels: ActionModels = {
      '3': { type: 'core', left: { actionSelect: 'none', subActionSelect: null }, right: { actionSelect: 'cutOff' } },
      '4': {
        type: 'core',
        left: { actionSelect: 'cutOffAndSkin', subActionSelect: 'insulate' },
        right: { actionSelect: 'isolate' },
      },
      '5': {
        type: 'core',
        left: { actionSelect: 'setOnContact' },
        right: { actionSelect: 'placeOnJacket', subActionSelect: 'noInsulate' },
      },
      '6': { type: 'shield', left: { actionSelect: 'none', subActionSelect: null }, right: { actionSelect: 'none' } },
    };

    const result = getNumberOfSubactionsWithinShield(item, actionModels);

    expect(result).toBe(2); // insulate, noInsulate are within the shield range
  });

  it('should return 0 if no subactions are found within shield range', () => {
    const item: Shield = {
      type: 'shield',
      lineOrder: 6,
      shieldedItemCount: 3,
      description: 'Test Shield',
      horizontalOrder: 1,
    };

    const actionModels: ActionModels = {
      '3': { type: 'core', left: { actionSelect: 'none' }, right: { actionSelect: 'cutOff' } },
      '4': { type: 'core', left: { actionSelect: 'cutOffAndSkin' }, right: { actionSelect: 'isolate' } },
      '5': { type: 'core', left: { actionSelect: 'none' }, right: { actionSelect: 'none' } },
      '6': { type: 'shield', left: { actionSelect: 'none' }, right: { actionSelect: 'none' } },
    };

    const result = getNumberOfSubactionsWithinShield(item, actionModels);

    expect(result).toBe(0);
  });

  it('should count subactions in both left and right sides within shield range', () => {
    const item: Shield = {
      type: 'shield',
      lineOrder: 6,
      shieldedItemCount: 3,
      description: 'Test Shield',
      horizontalOrder: 1,
    };

    const actionModels: ActionModels = {
      '3': {
        type: 'core',
        left: { actionSelect: 'cutOff', subActionSelect: 'insulate' },
        right: { actionSelect: 'mat017Item' },
      },
      '4': {
        type: 'core',
        left: { actionSelect: 'rollUp' },
        right: { actionSelect: 'placeOnJacket', subActionSelect: 'withCopperBand' },
      },
      '5': {
        type: 'core',
        left: { actionSelect: 'cutOff', subActionSelect: 'noInsulate' },
        right: { actionSelect: 'cutOffAndSkin', subActionSelect: 'noFix' },
      },
      '6': {
        type: 'shield',
        left: { actionSelect: 'none', subActionSelect: null },
        right: { actionSelect: 'none', subActionSelect: null },
      },
    };

    const result = getNumberOfSubactionsWithinShield(item, actionModels);

    expect(result).toBe(3); // insulate, withCopperBand, noFix are within the shield range
  });
});

describe('getNumberAndOrderOfSubactionsWithinTwist', () => {
  it('should return 0 subactions and an empty positions array when no subactions are present', () => {
    const twisting: Twisting = {
      type: 'twisting',
      twistedCoreCount: 3,
      lineOrder: 6,
      horizontalOrder: 1,
      forms: null,
    };

    const structure: CableStructureItemList = [
      {
        type: 'core',
        lineOrder: 1,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      {
        type: 'core',
        lineOrder: 2,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      {
        type: 'core',
        lineOrder: 3,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      twisting, // Twisting at index 3
    ];

    const result = getNumberAndOrderOfSubactionsWithinTwist(twisting, 3, structure);

    expect(result.numOfSubActions).toBe(0);
    expect(result.positions).toEqual([]);
  });

  it('should return correct number of subactions and their positions when subactions are present', () => {
    const twisting: Twisting = {
      type: 'twisting',
      twistedCoreCount: 3,
      lineOrder: 3,
      horizontalOrder: 1,
      forms: null,
    };

    const structure: CableStructureItemList = [
      {
        type: 'core',
        lineOrder: 1,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl('insulate'),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      {
        type: 'core',
        lineOrder: 2,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl('noInsulate'),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      {
        type: 'core',
        lineOrder: 3,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      twisting,
    ];

    const result = getNumberAndOrderOfSubactionsWithinTwist(twisting, 3, structure);

    expect(result.numOfSubActions).toBe(2);
    expect(result.positions).toEqual([2, 1]);
  });

  it('should skip items without forms and still count subactions correctly', () => {
    const twisting: Twisting = {
      type: 'twisting',
      twistedCoreCount: 3,
      lineOrder: 4,
      horizontalOrder: 1,
      forms: null,
    };

    const structure: CableStructureItemList = [
      { type: 'core', lineOrder: 1, forms: null } as Core, // No forms, should be skipped
      {
        type: 'core',
        lineOrder: 2,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl('insulate'),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      {
        type: 'core',
        lineOrder: 3,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl('noInsulate'),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      twisting, // Twisting at index 3
    ];

    const result = getNumberAndOrderOfSubactionsWithinTwist(twisting, 3, structure);

    expect(result.numOfSubActions).toBe(2);
    expect(result.positions).toEqual([3, 2]); // Inverse sequence of twisted cores
  });

  it('should return 0 subactions when twistedCoreCount is 0', () => {
    const twisting: Twisting = {
      type: 'twisting',
      twistedCoreCount: 0, // No twisted cores
      lineOrder: 6,
      horizontalOrder: 1,
      forms: null,
    };

    const structure: CableStructureItemList = [
      {
        type: 'core',
        lineOrder: 1,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl('insulate'),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      {
        type: 'core',
        lineOrder: 2,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl('noInsulate'),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      {
        type: 'core',
        lineOrder: 3,
        forms: {
          left: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
          right: {
            form: new FormGroup({
              subActionSelect: new FormControl(null),
            }),
            options: {} as FormlyFormOptions,
            fields: [] as FormlyFieldConfig[],
          },
        },
      } as Core,
      twisting,
    ];

    const result = getNumberAndOrderOfSubactionsWithinTwist(twisting, 3, structure);

    expect(result.numOfSubActions).toBe(0);
    expect(result.positions).toEqual([]);
  });
});

describe('removeUnusedNewLinesFromActionModels', () => {
  const actionModels: ActionModels = {
    '0': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '1': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '2': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '3': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
    '4': { left: { actionSelect: 'none' }, type: 'shield', right: { actionSelect: 'none' } },
    '5': { left: { actionSelect: 'none' }, type: 'litze', right: { actionSelect: 'none' } },
    '6': { left: { actionSelect: 'none' }, type: 'litze', right: { actionSelect: 'none' } },
    '7': {
      left: { actionSelect: 'setOnContact', pinDescriptionInput: '1' },
      type: 'litze',
      right: { actionSelect: 'none' },
    },
  };

  const bridges: Bridges = {
    left: [
      { end: [0, 5], start: [0, 0] },
      { end: [0, 7], start: [0, 1] },
    ],
    right: [
      { end: [0, 6], start: [0, 0] },
      { end: [0, 5], start: [0, 1] },
    ],
  };

  const pinAssignmentStructure: CableStructureItemList = [
    {
      type: 'core',
      lineOrder: 0,
    } as Core,
    {
      type: 'core',
      lineOrder: 1,
    } as Core,
    {
      type: 'core',
      lineOrder: 2,
    } as Core,
    {
      type: 'core',
      lineOrder: 3,
    } as Core,
    { type: 'shield', lineOrder: 4 } as Shield,
    { type: 'litze', lineOrder: 5 } as Litze,
    { type: 'litze', lineOrder: 6 } as Litze,
    { type: 'litze', lineOrder: 7 } as Litze,
  ];

  it('should return newline actionModels and pinAssignment structure created based on matching bridge values.', () => {
    const result = removeUnusedNewLinesFromActionModels(bridges, actionModels, pinAssignmentStructure);
    const actionModelKeys = Object.keys(result.actionModels);
    const pinAssignmentStructureKeys = Object.keys(result.pinAssignmentStructure);

    expect(actionModelKeys).toHaveLength(8);
    expect(pinAssignmentStructureKeys).toHaveLength(8);
  });

  it('should return actionModels and pinAssignment structure with no newlines having setOnContact when removed.', () => {
    const updatedBridges: Bridges = {
      ...bridges,
      left: [{ end: [0, 5], start: [0, 0] }],
    };
    const result = removeUnusedNewLinesFromActionModels(updatedBridges, actionModels, pinAssignmentStructure);

    const actionModelKeys = Object.keys(result.actionModels);
    const pinAssignmentStructureKeys = Object.keys(result.pinAssignmentStructure);

    const removedActionModel = {
      '7': {
        left: { actionSelect: 'setOnContact', pinDescriptionInput: '1' },
        type: 'litze',
        right: { actionSelect: 'none' },
      },
    };

    const removedPinAssignmentStructure = { type: 'litze', lineOrder: 7 } as Litze;

    expect(actionModelKeys).toHaveLength(7);
    expect(pinAssignmentStructureKeys).toHaveLength(7);
    expect(result.actionModels).not.toContain(removedActionModel);
    expect(result.pinAssignmentStructure).not.toContain(removedPinAssignmentStructure);
  });

  it('should return actionModels and pinAssignment structure with newline when either left or right have an action selected', () => {
    const updatedBridges: Bridges = {
      left: [{ end: [0, 7], start: [0, 1] }],
      right: [],
    };

    const newActionModels: ActionModels = {
      '0': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      '1': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      '2': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      '3': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      '4': { left: { actionSelect: 'none' }, type: 'shield', right: { actionSelect: 'none' } },
      '5': { left: { actionSelect: 'none' }, type: 'litze', right: { actionSelect: 'none' } },
      '6': { left: { actionSelect: 'none' }, type: 'litze', right: { actionSelect: 'none' } },
      '7': {
        left: { actionSelect: 'setOnContact', pinDescriptionInput: '1' },
        type: 'litze',
        right: { actionSelect: 'none' },
      },
    };
    const result = removeUnusedNewLinesFromActionModels(updatedBridges, newActionModels, pinAssignmentStructure);

    const actionModelKeys = Object.keys(result.actionModels);
    const pinAssignmentStructureKeys = Object.keys(result.pinAssignmentStructure);
    const removedActionModelFromLeftBridge = {
      '5': { left: { actionSelect: 'none' }, type: 'litze', right: { actionSelect: 'none' } },
    };

    expect(actionModelKeys).toHaveLength(6);
    expect(actionModelKeys).not.toContain('5');
    expect(actionModelKeys).not.toContain('6');
    expect(pinAssignmentStructureKeys).toHaveLength(6);
    expect(result.actionModels).not.toContain(removedActionModelFromLeftBridge);
  });

  it('should return actionModels and pinAssignment structure without litze type when no bridges exist', () => {
    const updatedBridges: Bridges = {
      left: [],
      right: [],
    };
    const newPinAssignmentStructure: CableStructureItemList = [
      {
        type: 'core',
        lineOrder: 0,
      } as Core,
      {
        type: 'core',
        lineOrder: 1,
      } as Core,
      {
        type: 'core',
        lineOrder: 2,
      } as Core,
      {
        type: 'core',
        lineOrder: 3,
      } as Core,
      { type: 'shield', lineOrder: 4 } as Shield,
      { type: 'litze', lineOrder: 5 } as Litze,
      { type: 'litze', lineOrder: 6 } as Litze,
      { type: 'litze', lineOrder: 7 } as Litze,
    ];

    const result = removeUnusedNewLinesFromActionModels(updatedBridges, actionModels, newPinAssignmentStructure);

    const actionModelKeys = Object.keys(result.actionModels);
    const pinAssignmentStructureKeys = Object.keys(result.pinAssignmentStructure);

    expect(actionModelKeys).toHaveLength(5);
    expect(pinAssignmentStructureKeys).toHaveLength(5);
    expect(actionModelKeys).not.toContain('5');
    expect(actionModelKeys).not.toContain('6');
    expect(actionModelKeys).not.toContain('7');
  });

  it('should return actionModels and pinAssignment structure without newline when bridges do not create newlines', () => {
    const noNewLineBridges: Bridges = {
      left: [{ end: [0, 3], start: [0, 1] }],
      right: [],
    };

    const newActionModels: ActionModels = {
      '0': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      '1': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      '2': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      '3': { left: { actionSelect: 'none' }, type: 'core', right: { actionSelect: 'none' } },
      '4': { left: { actionSelect: 'none' }, type: 'shield', right: { actionSelect: 'none' } },
      '5': { left: { actionSelect: 'none' }, type: 'litze', right: { actionSelect: 'none' } },
    };

    const newPinAssignmentStructure: CableStructureItemList = [
      {
        type: 'core',
        lineOrder: 0,
      } as Core,
      {
        type: 'core',
        lineOrder: 1,
      } as Core,
      {
        type: 'core',
        lineOrder: 2,
      } as Core,
      {
        type: 'core',
        lineOrder: 3,
      } as Core,
      { type: 'shield', lineOrder: 4 } as Shield,
      { type: 'litze', lineOrder: 5 } as Litze,
    ];

    const result = removeUnusedNewLinesFromActionModels(noNewLineBridges, newActionModels, newPinAssignmentStructure);
    const actionModelKeys = Object.keys(result.actionModels);
    const pinAssignmentStructureKeys = Object.keys(result.pinAssignmentStructure);

    expect(actionModelKeys).toHaveLength(5);
    expect(pinAssignmentStructureKeys).toHaveLength(5);
    expect(actionModelKeys).not.toContain('5');
    expect(pinAssignmentStructureKeys).not.toContain('5');
  });
});
