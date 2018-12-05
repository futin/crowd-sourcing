// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');

// internal modules

// internal modules
const { AuthUserModel } = require('@db-models');
const { AuthUserType } = require('@graphql-models');

const addAuthUser = {
  type: AuthUserType,
  description: 'Add new authenticated user',
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, { username }, context) => {
    /* (new AuthUserModel({ username })).save() */
    return AuthUserModel;
  },
};

module.exports = {
  addAuthUser,
};
