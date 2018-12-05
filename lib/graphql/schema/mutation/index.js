// core modules

// 3rd party modules
const {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

// internal modules
const { AuthUserType } = require('../../models');
const { AuthUserModel } = require('../../../database');

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthUser: {
      type: AuthUserType,
      description: 'Add new authenticated user',
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, { username }, context) => {
        /* (new AuthUserModel({ username })).save() */
        return AuthUserModel;
      },
    },
  },
});

module.exports = Mutation;
