// core node modules

// 3rd party modules

// internal alias modules

// internal modules
const authResolvers = require('./auth-resolver');
const inputValidator = require('./input-validator');

module.exports = {
  ...authResolvers,
  ...inputValidator,
};
