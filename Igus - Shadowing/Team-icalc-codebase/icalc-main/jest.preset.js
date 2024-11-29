const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  setupFiles: ['../../tools/helpers/jest-circus.helper.ts'],
  testMatch: ['**/+(*.)+(spec|test|unit).+(ts|js)?(x)'],
  collectCoverageFrom: ['**/*.ts', '!**/node_modules/**', '!**/index.ts', '!**/*.{test,spec,int,unit,mock}.ts'],
  coverageReporters: ['html', 'text-summary'],
  clearMocks: true,
  restoreMocks: true,
};
