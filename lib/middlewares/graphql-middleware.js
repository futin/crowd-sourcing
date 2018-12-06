// core node modules

// 3rd party modules
const graphqlHTTP = require('express-graphql');
const _ = require('lodash');

// internal modules
const schema = require('../graphql');
const databaseConnectors = require('@databases');
const {
  settings: {
    environment,
    databases: {
      mongodb: {
        connectorPath,
      },
    },
  },
} = require('@config');

module.exports = (req, res, next) => graphqlHTTP({
  schema,
  // only display graphiql interface while not in production
  graphiql: ['dev', 'local'].includes(environment),
  context: {
    user: req.user,
    connector: _.get(databaseConnectors, connectorPath),
  },
})(req, res, next);
