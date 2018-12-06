// core modules

// 3rd party modules
const {
  GraphQLSchema,
} = require('graphql');

// internal alias modules

// internal modules
const Query = require('./query');
const Mutation = require('./mutation');

const CrowdSourcingAppSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

module.exports = CrowdSourcingAppSchema;
