// core modules

// 3rd party modules

// internal alias modules

// internal modules
const authUserFields = require('./auth-user');
const categoryFields = require('./category');

module.exports = {
  ...authUserFields,
  ...categoryFields,
};
