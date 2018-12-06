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

const findAll = (modelName, query) => {
  logger('FindAll method called on [%s] with query %o', modelName, query);
  return models[modelName].find(query);
};

const findOne = (modelName, query) => {
  logger('FindOne method called on [%s] with query %o', modelName, query);
  return models[modelName].findOne(query);
};

const insertMany = (modelName, listOfCollections) => {
  logger('InsertMany method called on [%s] for list of collections %o', modelName, listOfCollections);
  return models[modelName].insertMany(listOfCollections);
};

const insertOne = (modelName, collection) => {
  logger('Insert method called on [%s] for collection %o', modelName, collection);
  return models[modelName].create(collection);
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
  execute,
};
