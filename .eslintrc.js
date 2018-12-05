'use strict';

module.exports = {
  extends: [
    'eslint-config-airbnb-base',
  ].map(require.resolve),
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2017,
  },
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