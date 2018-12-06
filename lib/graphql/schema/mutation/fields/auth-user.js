// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');

// internal modules

// internal modules
const { AuthUserType } = require('../../../models');

const addAuthUser = {
  type: AuthUserType,
  description: 'Add new authenticated user',
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, { username }, { connector }) => connector.insertOne('AuthUser', { username }),
};

module.exports = {
  addAuthUser,
};
