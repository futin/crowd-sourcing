'use strict';

// core node modules

// 3rd party modules
const graphqlHTTP = require('express-graphql');

// internal modules
const schema = require('../graphql/schema.js');
const { settings } = require('../config');

const { environment } = settings;

module.exports = graphqlHTTP({
  schema,
  // only display graphiql interface while not in production
  graphiql: ['dev', 'local'].includes(environment),
});
