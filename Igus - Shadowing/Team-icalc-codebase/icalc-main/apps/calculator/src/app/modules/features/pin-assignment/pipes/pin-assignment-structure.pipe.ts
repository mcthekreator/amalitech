import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { ActionSelection, IcalcBridge, IcalcDot } from '@igus/icalc-domain';
import { isDotOnSameVerticalLevel, isSameDot } from '@igus/icalc-domain';
import { ArrayUtils } from '@igus/icalc-utils';
import { TranslateService } from '@ngx-translate/core';
import transformCamelToScreamingSnakeCase from '@icalc/frontend/modules/features/pin-assignment/pipes/transform-camel-to-snake-case';

/**
 * These pipes define the current CSS class of the pin assignment structure
 * elements.
 * Depending on these CSS classes Elements show up, get hidden or change color.
 */
interface BridgeButtonParameter {
  button: {
    side: 'left' | 'right';
    dot: IcalcDot;
  };
  bridges: { left: IcalcBridge[]; right: IcalcBridge[] };
  currentBridgeSide: 'left' | 'right';
}

@Pipe({ name: 'actionModelValue' })
export class ActionModelValuePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  public transform(value: ActionSelection): string {
    const key = transformCamelToScreamingSnakeCase(value.actionSelect);
    const result = this.translateService.instant(`icalc.pin-assignment.${key}`);

    let addition = '';

    if (!value?.actionSelect || value.actionSelect === 'none') {
      return result;
    }

    if (value.actionSelect === 'skin' && value.skinLengthInput) {
      addition = `: ${value.skinLengthInput}mm`;
    }
    if (value.actionSelect === 'setOnContact') {
      addition = `: ${value.pinDescriptionInput ?? '?'}`;
    }
    if (value.actionSelect === 'mat017Item') {
      addition = `: ${value.mat017Item ?? '?'}`;
    }
    if (value.actionSelect === 'rollUp') {
      addition = `: ${value.rollUpInput ?? '?'}`;
    }
    return `${result}${addition}`;
  }
}

@Pipe({ name: 'isBridgeButtonDisabled' })
export class IsBridgeButtonDisabledPipe implements PipeTransform {
  public transform(cssClass: string): boolean {
    return cssClass.includes('disabled-dot') && !cssClass.includes('sharable-dot');
  }
}

@Pipe({ name: 'isLitzeSideActive' })
export class IsLitzeSideActivePipe implements PipeTransform {
  public transform(currentBridges: IcalcBridge[], yValueOfLitze): boolean {
    return !!currentBridges?.find?.((bridge) => bridge.end[1] === yValueOfLitze || bridge.start[1] === yValueOfLitze);
  }
}

@Pipe({ name: 'isLitzeDotVisible' })
export class IsLitzeDotVisible implements PipeTransform {
  public transform(currentBridge: IcalcBridge, parameter: BridgeButtonParameter): boolean {
    const result =
      currentBridge === null ||
      (parameter.currentBridgeSide === parameter?.button?.side &&
        parameter.button?.dot[0] === currentBridge?.start?.[0]);

    if (result === false) {
      return result;
    }
    return (
      parameter.bridges?.[parameter.button?.side]?.filter?.(
        (bridge) => bridge.end !== null && bridge.start?.[0] === parameter.button?.dot?.[0]
      )?.length < 2
    );
  }
}

@Pipe({ name: 'bridgeButton' })
export class BridgeButtonPipe implements PipeTransform {
  public transform(currentBridge: IcalcBridge, parameter: BridgeButtonParameter): string {
    let result = '';
    const bridges = parameter.bridges[parameter.button.side];
    const currentDot = parameter.button.dot;
    const isNewBridgeFirstDotSelected = currentBridge !== null && currentBridge.end === null;

    const startingDot = bridges.find((bridge) => isSameDot(bridge.start, currentDot));

    if (startingDot) {
      const isInitial = currentBridge && isSameDot(currentBridge.start, startingDot.start);

      result = `${result} ${isInitial ? 'initial' : 'starting'}-dot`;
      if (isNewBridgeFirstDotSelected && !isInitial) {
        result = result = `${result} disabled-dot`;
        if (isDotOnSameVerticalLevel(currentDot, currentBridge.start)) {
          result = result = `${result} sharable-dot`;
        }
      }
    }

    if (bridges.findIndex((bridge) => bridge.end && isSameDot(bridge.end, currentDot)) > -1) {
      result = `${result} ending-dot`;
      if (result.includes('ending-dot') && isNewBridgeFirstDotSelected) {
        result = result = `${result} disabled-dot`;
        if (isDotOnSameVerticalLevel(currentDot, currentBridge.start)) {
          result = result = `${result} sharable-dot`;
        }
      }
    }

    if (
      bridges.findIndex(
        (bridge) =>
          bridge.start?.[0] === currentDot[0] &&
          bridge.start?.[0] === currentDot[0] &&
          bridge.start?.[1] < currentDot[1] &&
          bridge.end?.[1] > currentDot[1]
      ) > -1
    ) {
      result = `${result} in-between-dot`;
      if (isNewBridgeFirstDotSelected) {
        result = `${result} in-between-dot disabled-dot`;
      }
    }

    if (
      !result &&
      isNewBridgeFirstDotSelected &&
      (parameter.currentBridgeSide !== parameter.button.side || currentBridge.start[0] !== currentDot[0])
    ) {
      result = 'hidden';
    }

    if (
      !result &&
      ArrayUtils.fallBackToEmptyArray<IcalcBridge>(bridges).filter(
        (bridge) => bridge.end?.[0] === currentDot[0] && bridge.start?.[0] === currentDot[0]
      ).length > 1
    ) {
      result = 'hidden';
    }

    return result || 'no-class';
  }
}
