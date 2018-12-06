// core modules

// 3rd party modules
const debug = require('debug');
const mongoose = require('mongoose');

// internal modules

// utils modules
const {
  settings: {
    dbUrl,
  },
  constants: {
    loggerNamespaces: { mongodbConnector },
  },
} = require('@config');

const logger = debug(mongodbConnector);

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
