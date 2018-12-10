// core modules

// 3rd party modules
const { GraphQLList, GraphQLString } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');

// internal modules
const { CategoryType } = require('../../../models');
const { roleValidatorResolver } = require('../../utils');

const category = {
  type: CategoryType,
  description: 'Fetch single category',
  args: { name: { type: GraphQLString } },
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    (parent, { name }, { connector }) => connector.findOne('Category', { name }),
  ),
};

const categories = {
  type: new GraphQLList(CategoryType),
  description: 'Fetch list of all categories',
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    (parent, args, { connector }) => connector.findAll('Category'),
  ),
};

module.exports = {
  category,
  categories,
};
