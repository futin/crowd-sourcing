// core modules

// 3rd party modules
const debug = require('debug');
const mongoose = require('mongoose');

// internal modules

// utils modules
const {
  settings,
  constants: {
    loggerNamespaces: { mongodbSetupNamespace },
  },
} = require('../config');

const { dbUrl } = settings;

const logger = debug(mongodbSetupNamespace);

const setupMongoose = () => {
  logger('Connecting to MongoDB: ', dbUrl);

  mongoose
    .connect(dbUrl)
    .then(() => {
      logger('Connected to MongoDB!');
    })
    .catch((e) => {
      logger('Unable to connect to MongoDB ', e);
      process.exit();
    });

  mongoose.Promise = global.Promise;
};

module.exports = setupMongoose;
