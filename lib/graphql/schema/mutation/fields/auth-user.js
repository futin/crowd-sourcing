// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const {
  constants: { roles },
} = require('@config');
const { ing } = require('@utils');

// internal modules
const { AuthUserType } = require('../../../models');
const { roleValidatorResolver } = require('../../utils');

const addAuthUser = {
  type: AuthUserType,
  description: 'Add new authenticated user. User will be unable to login unless he is authenticated.',
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: combineResolvers(roleValidatorResolver([roles.ADMIN]), (parent, { username }, { connector }) =>
    connector.insertOne('AuthUser', { username })),
};

const deleteAuthUser = {
  type: GraphQLString,
  description: 'Delete authenticated user and prevent User for further login',
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: combineResolvers(roleValidatorResolver([roles.ADMIN]), async (parent, { username }, { connector }) => {
    const [error] = await ing(connector.deleteOne('AuthUser', { username }));
    return error ? `Unable to delete auth user [${username}]` : `Successfully deleted auth user [${username}]`;
  }),
};

module.exports = {
  addAuthUser,
  deleteAuthUser,
};
