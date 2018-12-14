// core modules

// 3rd party modules
const debug = require('debug');
const _ = require('lodash');
const mongoose = require('mongoose');

// internal alias modules
const { ing } = require('@utils');
const {
  constants: {
    loggerNamespaces: {
      mongodbConnectorNamespace,
    },
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

const insertMany = (modelName, listOfCollections, options) => {
  logger('InsertMany method called on [%s] for list of collections %o with options %o',
    modelName, listOfCollections, options);
  return models[modelName].insertMany(listOfCollections, options);
};

const insertOne = (modelName, collection, options) => {
  logger('Insert method called on [%s] for collection %o', modelName, collection);
  return models[modelName].create(collection, options);
};

const update = (modelName, query, dataToUpdate, options) => {
  logger('Update method called on [%s] for query %o, update %o and options %o',
    modelName, query, dataToUpdate, options);
  return models[modelName].update(query, dataToUpdate, { upsert: true, ...options });
};

const updateMany = (modelName, filter, dataToUpdate, options) => {
  logger('UpdateMany method called on [%s] for filter %o, update %o and options %o',
    modelName, filter, dataToUpdate, options);
  return models[modelName].updateMany(filter, dataToUpdate, { upsert: true, ...options });
};

const upsertMany = (modelName, updateList) => {
  logger('UpsertMany method called on [%s] with update list %o',
    modelName, updateList);

  const promiseArray = updateList.map((updateObj) => {
    const query = updateObj.id ? { _id: updateObj.id } : { _id: mongoose.Types.ObjectId() };
    const updateWithoutId = _.omit(updateObj, 'id');

    return findOneAndUpdate(modelName, query, updateWithoutId, { upsert: true });
  });

  return Promise.all(promiseArray);
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

const insertNominationTransaction = async (nominationConfig) => {
  logger('InsertNominationTransaction called with configuration', nominationConfig);

  const { nominatedById, nominees } = nominationConfig;

  let session = null;
  // start a transaction session
  return models.Nominee.startSession()
    .then((_session) => {
      session = _session;
      session.startTransaction();

      // insertOne can accept "many" items as well... InsertMany currently not supported
      // for transaction purpose
      return insertMany('Nominee', nominees, { session });
    })
    .then(async (nomineeInstances = []) => {
      console.log('test');
      const nomineeIds = nomineeInstances.map(nominee => nominee.id);
      return insertOne('Nomination', [{ createdAt: new Date(), nominatedById, nomineeIds }], { session });
    })
    .then(([nominationInstance]) => {
      session.commitTransaction();
      return nominationInstance;
    })
    .catch(async (error) => {
      await session.abortTransaction();
      return error;
    });
};


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
  insertNominationTransaction,
  upsertMany,
  deleteMany,
  deleteOne,
  execute,
  getModel,
};
