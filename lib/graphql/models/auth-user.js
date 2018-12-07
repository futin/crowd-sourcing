// core modules

// 3rd party modules
const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

// internal alias modules

// internal modules

const AuthUserType = new GraphQLObjectType({
  name: 'AuthUser',
  description: 'All authenticated users can be found here',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = AuthUserType;
