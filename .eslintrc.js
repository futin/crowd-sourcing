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
          ['@databases', './lib/databases'],
          ['@utils', './lib/utils'],
          ['@services', './lib/services'],
        ],
        extensions: ['.js','.json']
      }
    }
  },
  rules: {
    'implicit-arrow-linebreak': 0,
    'max-len': ['error', { code: 120 }],
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