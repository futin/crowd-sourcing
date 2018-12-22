// core modules

// 3rd party GraphQLString
const {
  GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull,
} = require('graphql');

// internal alias modules

// internal modules

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  description: 'Input user payload',
  fields: () => ({
    pointsToAssign: { type: new GraphQLNonNull(GraphQLInt) },
    role: { type: new GraphQLNonNull(GraphQLString), description: 'Can be either "user" or "admin"' },
    fullName: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
  }),
});

module.exports = {
  UserInputType,
};
