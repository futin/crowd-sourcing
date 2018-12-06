// core modules

// 3rd party modules
const debug = require('debug');

// internal alias modules
const {
  constants: {
    loggerNamespaces: { mongodbConnector },
  },
} = require('@config');

// internal modules
const models = require('../models');

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

const findOneAndUpdate = (modelName, query, data, options) => {
  logger('FindOneAndUpdate method called on [%s] with next query: %o, data: %o and options %o',
    modelName, query, data, options);

  // set to return newly created document by default
  return models[modelName].findOneAndUpdate(query, data, { new: true, ...options });
};

const deleteOne = (modelName, filter) => {
  logger('DeleteOne method called on [%s] with filter %o', modelName, filter);
  return models[modelName].deleteOne(filter);
};

const deleteMany = (modelName, filter) => {
  logger('DeleteMany method called on [%s] with filter %o', modelName, filter);
  return models[modelName].deleteMany(filter);
};

const execute = (modelName, methodName, ...args) => {
  logger('Execute called on [%s] with method [%s] for args %o', modelName, methodName, ...args);
  return models[modelName][methodName](...args);
};

const getModel = modelName => models[modelName];

module.exports = {
  findAll,
  findOne,
  insertMany,
  insertOne,
  findOneAndUpdate,
  deleteMany,
  deleteOne,
  execute,
  getModel,
};
