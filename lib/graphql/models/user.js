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

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A user type, only valid for Serbia Technology!',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    fullName: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

module.exports = UserType;
