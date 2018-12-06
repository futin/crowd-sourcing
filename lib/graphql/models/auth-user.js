// core modules

// 3rd party modules
const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

// internal modules

// utils modules

const AuthUserType = new GraphQLObjectType({
  name: 'AuthUser',
  description: 'All authenticated users can be found here',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = AuthUserType;
