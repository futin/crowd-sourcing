// core modules

// 3rd party modules
const debug = require('debug');
const mongoose = require('mongoose');

// internal alias modules
const {
  settings: { databases: { mongodb: { url } } },
  constants: { loggerNamespaces: { mongodbConnectorNamespace } },
} = require('@config');
const { ing } = require('@utils');

// internal modules

const logger = debug(mongodbConnectorNamespace);

const setupMongoose = async () => {
  logger('Connecting to MongoDB: ', url);
  const { ObjectId } = mongoose.Types;

  // this hack is required so GraphQL can display ObjectId's as simple strings
  ObjectId.prototype.valueOf = function valueOf() {
    return this.toString();
  };

  const [error] = await ing(mongoose.connect(url));

  if (error) {
    logger('Unable to connect to MongoDB ', error);
    process.exit();
  }

  logger('Connected to MongoDB!');

  mongoose.Promise = global.Promise;
};

module.exports = setupMongoose;
