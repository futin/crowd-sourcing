// core modules

// 3rd party modules
const { GraphQLList, GraphQLString } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');

// internal modules
const { CategoryType } = require('../../../models');
const { roleValidator } = require('../../utils');

const categories = {
  type: new GraphQLList(CategoryType),
  description: 'List of all categories',
  resolve: combineResolvers(
    roleValidator([roles.admin]),
    (parent, args, { connector }) => connector.findAll('Category'),
  ),
};

const category = {
  type: CategoryType,
  description: 'Single category',
  args: { name: { type: GraphQLString } },
  resolve: combineResolvers(
    roleValidator([roles.admin]),
    (parent, { name }, { connector }) => connector.findOne('Category', { name }),
  ),
};

module.exports = {
  category,
  categories,
};
