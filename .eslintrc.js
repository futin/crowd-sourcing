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
};