/* eslint-disable */
export default {
  displayName: 'domain',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  coverageDirectory: '../../coverage/libs/domain',
  moduleFileExtensions: ['json', 'ts', 'tsx', 'js', 'mjs', 'jsx'],
  collectCoverageFrom: ['**/*.ts', '!**/node_modules/**', '!**/index.ts', '!**/*.{config,dto,environment}.ts'],
  coverageReporters: ['json'],
};
