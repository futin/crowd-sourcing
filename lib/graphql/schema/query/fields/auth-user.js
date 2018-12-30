// core modules

// 3rd party modules
const { GraphQLList, GraphQLString } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const {
  constants: { roles },
} = require('@config');

// internal modules
const { AuthUserType } = require('../../../models');
const { roleValidatorResolver } = require('../../utils');

const authUser = {
  type: AuthUserType,
  description: 'Fetch single auth user',
  args: { username: { type: GraphQLString } },
  resolve: combineResolvers(roleValidatorResolver([roles.ADMIN]), (parent, { username }, { connector }) =>
    connector.findOne('AuthUser', { username })),
};

const authUsers = {
  type: new GraphQLList(AuthUserType),
  description: 'Fetch list of authorized users',
  resolve: combineResolvers(roleValidatorResolver([roles.ADMIN]), (parent, args, { connector }) =>
    connector.findAll('AuthUser')),
};

module.exports = {
  authUser,
  authUsers,
};
