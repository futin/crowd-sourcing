// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');
const { ing } = require('@utils');

// internal modules
const { CategoryType } = require('../../../models');
const { roleValidator } = require('../../utils');

const addCategory = {
  type: CategoryType,
  description: 'Add new category',
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
  },
  resolve: combineResolvers(
    roleValidator([roles.admin]),
    (parent, args, { connector }) => connector.insertOne('Category', args),
  ),
};

const deleteCategory = {
  type: GraphQLString,
  description: 'Delete category by name',
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: combineResolvers(
    roleValidator([roles.admin]),
    async (parent, { name }, { connector }) => {
      const [error] = await ing(connector.deleteOne('Category', { name }));
      return error ? `Unable to delete category [${name}]` : `Successfully deleted category [${name}]`;
    },
  ),
};

module.exports = {
  addCategory,
  deleteCategory,
};
