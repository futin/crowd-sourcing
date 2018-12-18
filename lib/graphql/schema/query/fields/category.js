// core modules

// 3rd party modules
const { GraphQLList, GraphQLString } = require('graphql');

// internal alias modules

// internal modules
const { CategoryType } = require('../../../models');

const category = {
  type: CategoryType,
  description: 'Fetch single category',
  args: { name: { type: GraphQLString } },
  resolve: (parent, { name }, { connector }) => connector.findOne('Category', { name }),
};

const categories = {
  type: new GraphQLList(CategoryType),
  description: 'Fetch list of all categories',
  resolve: (parent, args, { connector }) => connector.findAll('Category'),
};

module.exports = {
  category,
  categories,
};
