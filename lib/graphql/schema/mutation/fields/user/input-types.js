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
    fullName: { type: GraphQLString },
    role: { type: GraphQLString, description: 'Can be either "user" or "admin"' },
    pointsToAssign: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

module.exports = {
  UserInputType,
};
