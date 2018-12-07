// core modules

// 3rd party GraphQLString
const { GraphQLInputObjectType, GraphQLNonNull } = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');

// internal alias modules

// internal modules

const DateInputType = new GraphQLInputObjectType({
  name: 'DateInput',
  description: 'Nomination date input',
  fields: () => ({
    dateFrom: { type: new GraphQLNonNull(GraphQLDate) },
    dateTo: { type: new GraphQLNonNull(GraphQLDate) },
  }),
});

module.exports = {
  DateInputType,
};
