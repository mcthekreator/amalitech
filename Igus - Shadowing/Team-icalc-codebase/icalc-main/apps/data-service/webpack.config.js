const { IgnorePlugin } = require('webpack');
const { composePlugins, withNx } = require('@nx/webpack');
const { withKopla } = require('@igus/kopla-data-tools');
const { additionalOptions } = require('../../webpack-options');
const { version } = require('./package.json');

const instrumentalizationConfig = {
  test: /\.(js|ts)$/,
  loader: '@jsdevtools/coverage-istanbul-loader',
  options: { esModules: true, produceSourceMap: true },
  enforce: 'post',
  include: [require('path').join(__dirname, '/src'), require('path').join(__dirname, '../..', 'libs')],
  exclude: [/\.(e2e|cy|config)\.ts$/, /node_modules/, /(ngfactory|ngstyle)\.js/, /@juicyllama\/nestjs-redoc/],
};

const rules = [
  {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  },
  {
    enforce: 'pre',
    test: /\.(ts|js)$/,
    include: /@juicyllama\/nestjs-redoc/,
    loader: require.resolve('string-replace-loader'),
    options: {
      search: "join(__dirname, '..', 'views', 'redoc.handlebars')",
      replace: "join(__dirname, 'views', 'redoc.handlebars')",
    },
  },
];

if (
  process.env.NX_TASK_TARGET_CONFIGURATION !== 'production' &&
  process.env.NX_TASK_TARGET_CONFIGURATION !== 'staging'
) {
  rules.push(instrumentalizationConfig);
}

module.exports = composePlugins(
  withNx(),
  withKopla(
    {
      replaceVersions: [{ search: 'DATA_SERVICE_VERSION_PLACEHOLDER', replace: version }],
    },
    additionalOptions,
    {
      module: {
        rules,
      },
      plugins: [
        new IgnorePlugin({
          checkResource(resource) {
            const lazyImports = [
              /^pg-native$/,
              /cloudflare:sockets/,
              /^@nestjs\/microservices/,
              /^@nestjs\/websockets/,
              /^@nestjs\/platform-express/,
              /^cache-manager/,
              /^class-validator/,
              /^class-transformer/,
              /^fastify-swagger/,
              /^swagger-ui-express/,
            ];

            if (!lazyImports.some((lazy) => lazy.test(resource))) {
              return false;
            }

            try {
              require.resolve(resource, {
                paths: [process.cwd()],
              });
            } catch (err) {
              return true;
            }
            return false;
          },
        }),
      ],
    }
  )
);
