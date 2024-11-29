/* eslint-disable */
export default {
  displayName: 'calculator',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  coverageDirectory: '../../coverage/apps/calculator',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
    '!**/index.ts',
    '!**/*.{test,cy,spec,int,unit,mock,module,config,d}.ts',
    '!**/{polyfills,locales,d,sentry}.ts',
    '!**/environments/*.ts',
    '!**/csg/create-worker.ts',
    '!**/csg/create-worker.test-only.ts',
    '!**/*.{preset, webpack-options}.js',
  ],
  transform: {
    '^.+.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^d3-(.*)': 'd3-$1/dist/d3-$1.js',
    '\\./create-worker$': './create-worker.test-only',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  coverageReporters: ['json'],
};
