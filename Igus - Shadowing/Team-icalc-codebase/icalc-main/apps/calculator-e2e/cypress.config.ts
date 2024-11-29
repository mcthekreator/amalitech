import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

import PluginConfigOptions = Cypress.PluginConfigOptions;

const setupNodeEvents = async (on: Cypress.PluginEvents, config: PluginConfigOptions): Promise<PluginConfigOptions> => {
  codeCoverageTask(on, config);
  on('before:browser:launch', (browser, launchOptions) => {
    // set lang by default to english - currently only works for chrome
    if (browser.name === 'chrome') {
      launchOptions.args.push('--accept-lang=en-US');
      return launchOptions;
    }
  });
  // will write to terminal in cli mode
  on('task', {
    log: (message) => {
      console.log(message);
      return true;
    },
  });
  await addCucumberPreprocessorPlugin(on, config);
  if (process.env.ENABLE_CUCUMBER_ICALC_579) {
    on(
      'file:preprocessor',
      createBundler({
        plugins: [createEsbuildPlugin(config)],
      })
    );
  }
  return config;
};
const cypressJsonConfig = {
  specPattern: process.env.ENABLE_CUCUMBER_ICALC_579 ? './src/tests/**/*.{feature,features}' : './src/tests/**/*.cy.ts',
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 16000,
  retries: {
    runMode: 3,
    openMode: 0,
  },
  sourceType: 'module',
  typescript: require.resolve('typescript'),
  setupNodeEvents,
  sourceType: 'module',
  typescript: require.resolve('typescript'),
  // downloadsFolder: './downloads', // TODO might be useful for excel export e2e tests (ICALC-363)
};

const apiUrl = process.env.DATA_SERVICE_URL || 'http://localhost:3000/api';

export default defineConfig({
  video: true,

  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
  },

  env: {
    apiUrl,
    codeCoverage: {
      url: apiUrl + '/coverage',
    },
  },
});
