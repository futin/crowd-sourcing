// core modules

// 3rd party modules
const debug = require('debug');

// internal alias modules
const {
  constants: {
    loggerNamespaces: { mongodbConnectorNamespace },
  },
} = require('@config');

// internal modules
const models = require('../models');

const logger = debug(mongodbConnectorNamespace);

const findAll = (modelName, filter) => {
  logger('FindAll method called on [%s] with filter %o', modelName, filter);
  return models[modelName].find(filter);
};

const findManyById = (modelName, data) => {
  logger('FindMany method called on [%s] with data %o', modelName, data);
  return models[modelName].find({
    _id: { $in: data },
  });
};

const findOne = (modelName, filter) => {
  logger('FindOne method called on [%s] with filter %o', modelName, filter);
  return models[modelName].findOne(filter);
};

const findById = (modelName, id) => {
  logger('FindById method called on [%s] with id %o', modelName, id);
  return models[modelName].findById(id);
};

const findOneAndUpdate = (modelName, query, updateData, options) => {
  logger('FindOneAndUpdate method called on [%s] with next query: %o, updateData: %o and options %o',
    modelName, query, updateData, options);

  // set to return newly created document by default
  return models[modelName].findOneAndUpdate(query, updateData, { new: true, ...options });
};

const findAllByDate = (modelName, date, filter) => {
  const { dateFrom, dateTo } = date;
  logger('FindAllByDate method called on [%s] with next dateFrom: %s and dateTo: %s',
    modelName, dateFrom, dateTo);

  // set to return newly created document by default
  return models[modelName].find({
    createdAt: {
      $gte: dateFrom,
      $lte: dateTo,
    },
    ...filter,
  });
};

const insertMany = (modelName, listOfCollections) => {
  logger('InsertMany method called on [%s] for list of collections %o', modelName, listOfCollections);
  return models[modelName].insertMany(listOfCollections);
};

const insertOne = (modelName, collection) => {
  logger('Insert method called on [%s] for collection %o', modelName, collection);
  return models[modelName].create(collection);
};

const update = (modelName, query, dataToUpdate, options) => {
  logger('Update method called on [%s] for query %o, update %o and options %o',
    modelName, query, dataToUpdate, options);
  return models[modelName].update(query, dataToUpdate, options);
};

const updateMany = (modelName, filter, dataToUpdate, options) => {
  logger('UpdateMany method called on [%s] for filter %o, update %o and options %o',
    modelName, filter, dataToUpdate, options);
  return models[modelName].updateMany(filter, dataToUpdate, { upsert: true, ...options });
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
  findById,
  findOneAndUpdate,
  findAllByDate,
  findManyById,
  insertMany,
  insertOne,
  update,
  updateMany,
  deleteMany,
  deleteOne,
  execute,
  getModel,
};
