// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal modules
const { roleValidator } = require('../../utils');
const { constants: { roles } } = require('@config');
// internal modules
const { AuthUserType } = require('../../../models');

const addAuthUser = {
  type: AuthUserType,
  description: 'Add new authenticated user',
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: combineResolvers(
    roleValidator([roles.admin]),
    (parent, { username }, { connector }) => connector.insertOne('AuthUser', { username }),
  ),
};

module.exports = {
  addAuthUser,
};
