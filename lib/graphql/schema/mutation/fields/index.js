// core modules

// 3rd party modules

// internal alias modules

// internal modules
const userFields = require('./user');
const authUserFields = require('./auth-user');
const categoryFields = require('./category');

module.exports = {
  ...userFields,
  ...authUserFields,
  ...categoryFields,
};
