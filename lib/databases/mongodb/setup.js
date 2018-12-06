// core modules

// 3rd party modules
const debug = require('debug');
const mongoose = require('mongoose');

// internal modules

// utils modules
const {
  settings: {
    databases: {
      mongodb: {
        url,
      },
    },
  },
  constants: {
    loggerNamespaces: { mongodbConnector },
  },
} = require('@config');

const logger = debug(mongodbConnector);

const setupMongoose = () => {
  logger('Connecting to MongoDB: ', url);

  mongoose
    .connect(url)
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
