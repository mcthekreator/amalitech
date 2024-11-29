import type { FormControl } from '@angular/forms';
import type { ErrorStateMatcher } from '@angular/material/core';

export class IcalcErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && control.dirty);
  }
}
export class FormUtils {
  public static checkNumeric(_field: unknown, event: KeyboardEvent): void {
    if (event.shiftKey) {
      event.preventDefault(); // Prevent character input
    }

    if (FormUtils.isNotAllowedKey(event.key)) {
      event.preventDefault(); // Prevent character input
    }
  }

  private static isNotAllowedKey(key: string): boolean {
    const allowedNonNumericKeys = [
      'Tab',
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'End',
      'Home',
      ',',
    ];

    const isAllowedNonNumeric = allowedNonNumericKeys.includes(key);
    const isNumeric = /\d/.test(key);

    return !(isAllowedNonNumeric || isNumeric);
  }
}
