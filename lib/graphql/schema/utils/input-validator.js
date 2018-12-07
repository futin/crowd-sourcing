// core node modules

// 3rd party modules
const _ = require('lodash');

// internal alias modules

// internal modules

/**
 * It compiles the arguments in such a way that only truthy fields are preserved.
 *
 * @param {Object} args
 */
const pickThruthy = args => _.reduce(args, (result, itemValue, itemKey) => {
  Object.assign(result,
    itemValue && { [itemKey]: itemValue });

  return result;
}, {});

const isAnyMandatoryFieldProvided = (...requiredFields) => requiredFields.some(Boolean);

module.exports = {
  pickThruthy,
  isAnyMandatoryFieldProvided,
};
