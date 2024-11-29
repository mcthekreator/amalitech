/* eslint-disable */
export default {
  displayName: 'calculations-infrastructure',
  preset: '../../../nested-libs-jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  coverageDirectory: '../../../coverage/libs/calculations/infrastructure',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverageFrom: ['**/*.ts', '!**/node_modules/**', '!**/index.ts', '!**/*.{config,dto,environment}.ts'],
  coverageReporters: ['json'],
};
