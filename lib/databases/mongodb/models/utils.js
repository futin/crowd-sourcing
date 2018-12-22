// core modules

// 3rd party modules
const debug = require('debug');

// internal alias modules
const { ing } = require('@utils');
const {
  constants: {
    loggerNamespaces: {
      mongodbModelsUtilsNamespace,
    },
  },
} = require('@config');

// internal modules

const logger = debug(mongodbModelsUtilsNamespace);

// validate provided id for specific model,
// and throw corresponding error if wrong something went wrong
const isRelationValid = async (Model, id) => {
  const [error, instance] = await ing(Model.findById(id));

  if (error) {
    logger(error);
    return false;
  }

  if (!instance) {
    logger(`Invalid id [${id}] provided for ${Model.modelName}`);
    return false;
  }

  // all good here!
  return true;
};

module.exports = {
  isRelationValid,
};
