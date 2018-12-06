// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');
const { ing } = require('@utils');

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

const deleteAuthUser = {
  type: GraphQLString,
  description: 'Delete authenticated user',
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: combineResolvers(
    roleValidator([roles.admin]),
    async (parent, { username }, { connector }) => {
      const [error] = await ing(connector.deleteOne('AuthUser', { username }));
      return error ? `Unable to delete [${username}]` : `Successfully deleted [${username}]`;
    },
  ),
};

module.exports = {
  addAuthUser,
  deleteAuthUser,
};
