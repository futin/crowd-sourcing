// core modules

// 3rd party modules

// internal modules

// utils modules
const setupMongoose = require('./setup');
const models = require('./models');

module.exports = {
  setupMongoose,
  ...models,
};
