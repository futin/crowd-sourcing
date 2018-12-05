'use strict';

// core node modules

// 3rd party modules
const {
  // These are the basic GraphQL types need in this tutorial
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  // This is used to create required fileds and arguments
  GraphQLNonNull,
  // This is the class we need to create the schema
  GraphQLSchema,
} = require('graphql');

// internal modules

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Crowd-sourcing Schema Query Root',
  fields: {
    message: {
      type: GraphQLString,
      description: 'test',
      resolve() {
        return 'Hello world!!!';
      },
    },
  },
});

const CrowdSourcingAppSchema = new GraphQLSchema({
  query: RootQuery,
  // mutation: Mutation,
});

module.exports = CrowdSourcingAppSchema;
