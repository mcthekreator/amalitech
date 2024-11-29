const additionalOptions = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(ts|js)$/,
        include: /@kopla\/data/,
        loader: require.resolve('string-replace-loader'),
        options: {
          search: '../../src/ssl/certs/ca.crt',
          replace: '/ssl/certs/ca.crt',
        },
      },
    ],
  },
};

module.exports = { additionalOptions };
