// core modules

// 3rd party GraphQLString
const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
} = require('graphql');

// internal alias modules

// internal modules

const NomineeInputType = new GraphQLInputObjectType({
  name: 'NomineeInput',
  description: 'A nominee input type used for nominee creation',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLID) },
    categoryId: { type: new GraphQLNonNull(GraphQLID) },
    numberOfPoints: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

module.exports = {
  NomineeInputType,
};
