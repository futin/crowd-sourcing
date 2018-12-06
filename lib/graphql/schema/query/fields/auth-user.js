// core modules

// 3rd party modules
const { GraphQLList } = require('graphql');

// internal modules

// internal modules
const { AuthUserType } = require('../../../models');

const authUsers = {
  type: new GraphQLList(AuthUserType),
  description: 'List of authorized users',
  resolve: (parent, args, { connector }) => connector.findAll('AuthUser'),
};

const authUser = {
  type: AuthUserType,
  description: 'Single auth user',
  resolve: (parent, { username }, { connector }) => connector.findOne('AuthUser', { username }),
};

module.exports = {
  authUser,
  authUsers,
};
