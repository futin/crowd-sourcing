// core modules

// 3rd party modules
const {
  GraphQLID, GraphQLString, GraphQLObjectType, GraphQLNonNull,
} = require('graphql');

// internal alias modules

// internal modules

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  description: "Category describes an action behind each Nomination's Nominee.",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
  }),
});

module.exports = CategoryType;
