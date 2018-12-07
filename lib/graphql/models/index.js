// core modules

// 3rd party modules

// internal alias modules

// internal modules
const UserType = require('./user');
const AuthUserType = require('./auth-user');
const CategoryType = require('./category');
const nominationTypes = require('./nomination');

module.exports = {
  UserType,
  AuthUserType,
  CategoryType,
  ...nominationTypes,
};
