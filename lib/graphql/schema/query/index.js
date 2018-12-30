// core modules

// 3rd party modules
const { GraphQLObjectType } = require('graphql');

// internal alias modules

// internal modules
const fields = require('./fields');

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Crowd-sourcing Schema Query',
  fields,
});

module.exports = Query;
