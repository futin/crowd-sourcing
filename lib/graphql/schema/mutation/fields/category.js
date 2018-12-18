// core modules

// 3rd party GraphQLString
const { GraphQLString, GraphQLNonNull } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');
const { ing } = require('@utils');

// internal modules
const { CategoryType } = require('../../../models');
const { roleValidatorResolver } = require('../../utils');

const addCategory = {
  type: CategoryType,
  description: 'Add new category, used when creating Nomination (or actually Nominee)',
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
  },
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    (parent, args, { connector }) => connector.insertOne('Category', args),
  ),
};

const updateCategory = {
  type: CategoryType,
  description: 'Update category description',
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    (parent, { name, description }, { connector }) => connector.findOneAndUpdate('Category', { name }, { description }),
  ),
};

const deleteCategory = {
  type: GraphQLString,
  description: 'Delete category by name',
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: combineResolvers(
    roleValidatorResolver([roles.admin]),
    async (parent, { name }, { connector }) => {
      const [error] = await ing(connector.deleteOne('Category', { name }));
      return error ? `Unable to delete category [${name}]` : `Successfully deleted category [${name}]`;
    },
  ),
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
};
