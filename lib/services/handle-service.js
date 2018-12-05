'use strict';

// node core modules

// 3rd party modules
const debug = require('debug');

// internal modules
const {
  constants: {
    loggerNamespaces: { handleServiceNamespace },
  },
} = require('../config');
const Handles = require('../models/handle-model');

const logger = debug(handleServiceNamespace);

const handleService = {
  isHandleValid(handleName) {
    logger(`Attempting to find handle in db, handle provided: ${handleName}`);
    return Handles.findOne({ handleName })
      .then(handle => !!handle)
      .catch((error) => {
        logger('Could not fetch handle from the db', error);
        return error;
      });
  },
};

module.exports = handleService;
