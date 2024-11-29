const preset = require('./jest.preset.js');

// Set the path so that nested libs can find helper file
preset.setupFiles = ['../../../tools/helpers/jest-circus.helper.ts'];

module.exports = preset;
