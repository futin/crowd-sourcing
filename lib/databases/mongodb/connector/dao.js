// core modules

// 3rd party modules
const debug = require('debug');
const _ = require('lodash');
const mongoose = require('mongoose');

// internal alias modules
const {
  constants: {
    loggerNamespaces: {
      mongodbConnectorNamespace,
    },
  },
} = require('@config');


// internal modules
const models = require('../models');
const transactions = require('./transactions');
const aggregations = require('./aggregations');
const { mongodbIdBuilder } = require('../utils');

const logger = debug(mongodbConnectorNamespace);

/* *********************************************** Find methods ***************************************************** */
// most of the find methods require "projection" as second argument.
// Since we are using GraphQL, projection is not required

const findById = function findById(modelName, id, options) {
  logger('FindById method called on [%s] with id %o', modelName, id);
  return models[modelName].findById(id, null, options);
};

const findOne = function findOne(modelName, filter, options) {
  logger('FindOne method called on [%s] with filter %o', modelName, filter);
  return models[modelName].findOne(filter, null, options);
};

const findAll = function findAll(modelName, filter, options) {
  logger('FindAll method called on [%s] with filter %o', modelName, filter);
  return models[modelName].find(filter, null, options);
};

const findManyById = function findManyById(modelName, data, options) {
  logger('FindMany method called on [%s] with data %o', modelName, data);
  const query = { _id: { $in: data } };
  return models[modelName].find(query, null, options);
};

const findAllByDate = function findAllByDate(modelName, dateConfig, filter) {
  const { dateFrom, dateTo } = dateConfig;
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

/* ***************************************** Find and update methods ************************************************ */

const findOneAndUpdate = function findOneAndUpdate(modelName, query, updateData, options) {
  logger('FindOneAndUpdate method called on [%s] with next query: %o, updateData: %o and options %o',
    modelName, query, updateData, options);

  // set to return newly created document by default
  return models[modelName].findOneAndUpdate(query, updateData, { new: true, ...options });
};

const findAndUpsertMany = function findAndUpsertMany(modelName, modelsList, identifiers = ['_id'], additionalOptions) {
  logger('FindAndUpsertMany method called on [%s] with models list %o and identifiers %o',
    modelName, modelsList, identifiers);

  const promiseArray = modelsList.map((model) => {
    const filter = _.pick(model, identifiers);

    // if filter is not empty, use it to upsert model. Otherwise just create new id.
    const query = !_.isEmpty(filter) ? filter : { _id: mongodbIdBuilder() };
    // if "id" does not exist (new item), we don't want to set it to null
    // "id" is going to be created by query automatically, if it is not previously provided
    const updateWithoutId = _.omit(model, 'id');
    const options = { upsert: true, runValidators: true, ...additionalOptions };

    return findOneAndUpdate(modelName, query, updateWithoutId, options);
  });

  return Promise.all(promiseArray);
};

/* ********************************************* Insert methods ***************************************************** */

const insertOne = function insertOne(modelName, collection, options) {
  logger('Insert method called on [%s] for collection %o', modelName, collection);
  return models[modelName].create(collection, options);
};

const insertMany = function insertMany(modelName, listOfCollections, options) {
  logger('InsertMany method called on [%s] for list of collections %o with options %o',
    modelName, listOfCollections, options);
  return models[modelName].insertMany(listOfCollections, options);
};

/* ********************************************* Update methods ***************************************************** */

const update = function update(modelName, query, dataToUpdate, options) {
  logger('Update method called on [%s] for query %o, update %o and options %o',
    modelName, query, dataToUpdate, options);
  return models[modelName].updateOne(query, dataToUpdate, { upsert: true, ...options });
};

const updateMany = function updateMany(modelName, filter, dataToUpdate, options) {
  logger('UpdateMany method called on [%s] for filter %o, update %o and options %o',
    modelName, filter, dataToUpdate, options);
  return models[modelName].updateMany(filter, dataToUpdate, { upsert: true, ...options });
};

/* ********************************************* Delete methods ***************************************************** */

const deleteOne = function deleteOne(modelName, filter, options) {
  logger('DeleteOne method called on [%s] with filter %o', modelName, filter, options);
  return models[modelName].deleteOne(filter);
};

const deleteMany = function deleteMany(modelName, filter, options) {
  logger('DeleteMany method called on [%s] with filter %o', modelName, filter);
  return models[modelName].deleteMany(filter, options);
};

/* ******************************************** Execute methods ***************************************************** */

/**
 * This generic method is used to execute any available Dao method with arguments.
 *
 * @param {String} methodName   - name of the Dao method. Error is thrown if invalid method name is provided
 * @param {String} modelName    - name of a model that is used within Dao method.
 * @param {Array} args          - list of any number of arguments used by the Dao method.
 * @returns {*}
 */
const executeDaoMethod = function executeDaoMethod(methodName, modelName, ...args) {
  logger('ExecuteDaoMethod called for [%s] with args %o', methodName, ...args);

  const daoMethod = this[methodName];

  // otherwise it must be an internal method
  if (daoMethod) {
    return daoMethod(modelName, ...args);
  }

  throw new Error(`Invalid methodName provided [${methodName}]`);
};

/**
 * This generic method is used to execute any available database collection method.
 *
 * @param {String} modelName    - name of a model/collection that should be used for execution. Error is thrown if
 *                                 invalid model name is provided
 * @param {String} methodName   - name of the Dao method. Error is thrown if invalid method name is provided
 * @param {Array} args          - list of any number of arguments used by the database model/collection.
 * @returns {*}
 */
const executeDbMethod = function executeDbMethod(modelName, methodName, ...args) {
  logger('Execute called for [%s] with args %o', modelName, ...args);

  const model = models[modelName];

  // should execute be called upon model instance ?
  if (model) {
    return model[methodName](args);
  }

  throw new Error(`Invalid modelName provided [${modelName}]`);
};

/**
 *  Generic transaction executioner. It calls provided transaction method by name, and passed the args to it.
 *  Alongside with arguments, it is provided:
 *    - {Object} mongoose             - instance of mongoose library
 *    - {Function} executeDaoMethod   - execute method, so that transactions can call any Dao method.
 *
 * @param {String} transactionName    - name of the transaction that should be invoked. Error is thrown if
 *                                      invalid transaction name is provided
 * @param {Array} args                - list of any number of arguments used by the transaction
 * @returns {*}
 */
const executeTransaction = function executeTransaction(transactionName, ...args) {
  const transaction = transactions[transactionName];

  if (transaction) {
    // bind the execute method to "dao" object
    return transaction(mongoose, executeDaoMethod.bind(this), ...args);
  }

  throw new Error(`Invalid transaction name provided: ${transactionName}`);
};

/**
 * Generic aggregation executioner. It calls provided aggregation method by name, and passed the args to it.
 *  Alongside with arguments models are provided, since the aggregation is core mongodb feature and it is being
 *  applied on mongodb collections.
 *
 * @param {String} aggregationName    - name of the aggregation that should be invoked. Error is thrown if
 *                                      invalid aggregation name is provided
 * @param {Array} args                - list of any number of arguments used by the aggregation
 * @returns {*}
 */
const executeAggregation = function executeAggregation(aggregationName, ...args) {
  const aggregation = aggregations[aggregationName];

  if (!aggregation) {
    return aggregation(models, ...args);
  }

  throw new Error(`Invalid aggregation name provided: ${aggregationName}`);
};

/* ********************************************* Other methods ****************************************************** */

const getModel = modelName => models[modelName];

const dao = {
  // find methods
  findById,
  findOne,
  findAll,
  findManyById,
  findAllByDate,

  // find and update methods
  findOneAndUpdate,
  findAndUpsertMany,

  // insert methods
  insertOne,
  insertMany,

  // update methods
  update,
  updateMany,

  // delete methods
  deleteOne,
  deleteMany,

  // execute generic methods
  executeDaoMethod,
  executeDbMethod,
  executeTransaction,
  executeAggregation,

  // other methods
  getModel,
};

module.exports = dao;
