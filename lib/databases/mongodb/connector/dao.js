// core modules

// 3rd party modules
const debug = require('debug');

// internal modules

// utils modules
const models = require('../models');
const {
  constants: {
    loggerNamespaces: { mongodbConnector },
  },
} = require('@config');

const logger = debug(mongodbConnector);

const findAll = (modelName, filter) => {
  logger('FindAll method called on [%s] with filter %o', modelName, filter);
  return models[modelName].find(filter);
};

const findOne = (modelName, filter) => {
  logger('FindOne method called on [%s] with filter %o', modelName, filter);
  return models[modelName].findOne(filter);
};

const insertMany = (modelName, listOfCollections) => {
  logger('InsertMany method called on [%s] for list of collections %o', modelName, listOfCollections);
  return models[modelName].insertMany(listOfCollections);
};

const insertOne = (modelName, collection) => {
  logger('Insert method called on [%s] for collection %o', modelName, collection);
  return models[modelName].create(collection);
};

const deleteOne = (modelName, filter) => {
  logger('DeleteOne method called on [%s] with filter %o', modelName, filter);
  return models[modelName].deleteOne(filter);
};

const deleteMany = (modelName, filter) => {
  logger('DeleteMany method called on [%s] with filter %o', modelName, filter);
  return models[modelName].deleteMany(filter);
};

const execute = (modelName, methodName, data) => {
  logger('Execute called on [%s] with method [%s] for data %o', modelName, methodName, data);
  return models[modelName][methodName](data);
};

module.exports = {
  findAll,
  findOne,
  insertMany,
  insertOne,
  deleteMany,
  deleteOne,
  execute,
};
