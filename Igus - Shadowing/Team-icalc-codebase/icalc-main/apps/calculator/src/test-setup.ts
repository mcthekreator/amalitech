import 'jest-preset-angular/setup-jest';

// Polyfills for jsdom
if (typeof document !== 'undefined') {
  HTMLElement.prototype.scrollIntoView = jest.fn();
}
