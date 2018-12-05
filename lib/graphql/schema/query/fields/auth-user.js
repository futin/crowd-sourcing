// core modules

// 3rd party modules
const { GraphQLList } = require('graphql');

// internal modules

// internal modules
const { AuthUserModel } = require('@db-models');
const { AuthUserType } = require('@graphql-models');

const authUsers = {
  type: new GraphQLList(AuthUserType),
  description: 'List of authorized users',
  resolve: () => AuthUserModel.find(),
};

module.exports = {
  authUsers,
};
