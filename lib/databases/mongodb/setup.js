// core modules

// 3rd party modules
const debug = require('debug');
const mongoose = require('mongoose');

// internal alias modules
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

// internal modules

const logger = debug(mongodbConnector);

const setupMongoose = () => {
  logger('Connecting to MongoDB: ', url);
  const { ObjectId } = mongoose.Types;

  // this hack is required so GraphQL can display ObjectId's as simple strings
  ObjectId.prototype.valueOf = function valueOf() {
    return this.toString();
  };

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
