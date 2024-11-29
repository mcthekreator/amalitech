/* eslint-disable */
export default {
  displayName: 'configurations-application',
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
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/configurations/application',
  coverageReporters: ['json'],
};
