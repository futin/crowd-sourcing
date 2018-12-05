module.exports = {
  extends: [
    'eslint-config-airbnb-base',
  ].map(require.resolve),
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 9,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@config', './lib/config'],
          ['@db-models', './lib/database/models'],
          ['@graphql-models', './lib/graphql/models'],
          ['@utils', './lib/utils'],
          ['@services', './lib/services'],
        ],
        extensions: ['.js','.json']
      }
    }
  }
  // overrides: [
  //   {
  //     files: ['**/*.test.js'],
  //     parserOptions: {
  //       ecmaVersion: 2017,
  //       sourceType: 'module',
  //     },
  //     rules: {
  //       extends: 'plugin:ava/recommended',
  //       plugins: ['ava'],
  //       rules: {
  //         'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  //       },
  //     },
  //   },
  // ],
};