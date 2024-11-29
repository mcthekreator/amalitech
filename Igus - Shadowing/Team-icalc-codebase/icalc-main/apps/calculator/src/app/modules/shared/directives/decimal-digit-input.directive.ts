import { Directive, HostListener, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const specialKeys = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

const buildNextValue = (event?: KeyboardEvent): string => {
  const inputElement = event?.target as HTMLInputElement;
  const current = `${inputElement.value}`;
  const position = inputElement.selectionStart || 0;

  return [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
};

/**
 * handleDecimalDigitInput
 *
 * default fractions = 3
 */
export const handleDecimalDigitInput = (event?: KeyboardEvent, language?, fractions = 3): void => {
  if (specialKeys.indexOf(event.key) !== -1) {
    return;
  }

  const regex = language === 'de' ? /^\d*,?(\d*)$/g : /^\d*\.?(\d*)$/g;
  const next = buildNextValue(event);

  const match = regex.exec(String(next));
  const foundFractions = match && match.length === 2 ? String(match[1]).length : 0; // match.length === 2 tells us there are decimal digits, match[1] contains digits after the decimal point

  if (next && (!match || foundFractions > fractions)) {
    // checks for wrong decimal separator (no match) or wrong number of decimal places
    event.preventDefault();
  }
};

/**
 * DecimalDigitInputDirective
 *
 * default fractions = 3
 */
@Directive({
  selector: '[icalcDecimalDigitInput]',
})
export class DecimalDigitInputDirective {
  @Input()
  public fractions = 3;

  constructor(private translate: TranslateService) {}

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    return handleDecimalDigitInput(event, this.translate.currentLang, this.fractions);
  }
}
