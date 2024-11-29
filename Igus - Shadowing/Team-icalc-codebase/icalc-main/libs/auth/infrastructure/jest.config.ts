/* eslint-disable */
export default {
  displayName: 'auth-infrastructure',
  preset: '../../../nested-libs-jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  coverageDirectory: '../../../coverage/libs/auth/infrastructure',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
    '!**/*.{test,cy,spec,int,unit,mock,module,config,d}.ts',
    '!**/*.{preset, webpack-options}.js',
  ],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  coverageReporters: ['json'],
};
