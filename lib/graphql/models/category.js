// core modules

// 3rd party modules
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

// internal alias modules

// internal modules

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  description: 'All categories can be found here',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
  }),
});

module.exports = CategoryType;
