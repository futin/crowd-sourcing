'use strict';

// core node modules

// 3rd party modules

// internal modules
const authMiddleware = require('./auth-middleware');
const graphqlMiddleware = require('./graphql-middleware');

module.exports = {
  authMiddleware,
  graphqlMiddleware,
};
