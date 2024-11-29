const { config } = require('@igus/kopla-app-tools');
const { version } = require('./package.json');
const icalcDomainJson = require('@igus/icalc-domain/package.json');
const koplaJson = require('@igus/kopla-app/package.json');
const koplaDomainJson = require('@igus/kopla-domain/package.json');

const replaceVersions = [
  { search: 'ICALC_APP_PLACEHOLDER', replace: version },
  { search: 'ICALC_DOMAIN_PLACEHOLDER', replace: icalcDomainJson.version },
  { search: 'KOPLA_APP_PLACEHOLDER', replace: koplaJson.version },
  { search: 'KOPLA_DOMAIN_PLACEHOLDER', replace: koplaDomainJson.version },
];

const instrumentalizationConfig = {
  test: /\.(js|ts)$/,
  loader: '@jsdevtools/coverage-istanbul-loader',
  options: { esModules: true, produceSourceMap: true },
  enforce: 'post',
  include: [require('path').join(__dirname, '/src')],
  exclude: [/\.(e2e|spec|cy)\.ts$/, /node_modules/, /(ngfactory|ngstyle)\.js/],
};

const rules = [];

if (
  process.env.NX_TASK_TARGET_CONFIGURATION !== 'production' &&
  process.env.NX_TASK_TARGET_CONFIGURATION !== 'staging'
) {
  rules.push(instrumentalizationConfig);
}

module.exports = (webpackConfig) => {
  return config(
    {
      pathToRoot: __dirname,
      version,
      replaceVersions,
    },
    webpackConfig,
    {
      module: {
        rules,
      },
    }
  );
};
