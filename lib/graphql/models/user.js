// core modules

// 3rd party modules
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

// internal alias modules

// internal modules

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'All users can be found here',
  fields: () => ({
    email: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    fullName: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

module.exports = UserType;
