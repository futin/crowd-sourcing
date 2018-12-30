// core node modules

// 3rd party modules
const mongoose = require('mongoose');

// internal alias modules

// internal modules
const { isRelationValid } = require('./utils');
const UserModel = require('./user-model');
const CategoryModel = require('./category-model');

const { Schema } = mongoose;

const NomineeSchema = Schema({
  categoryId: {
    type: Schema.ObjectId,
    ref: 'Category',
    validate: {
      validator: id => isRelationValid(CategoryModel, id),
    },
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    validate: {
      validator: id => isRelationValid(UserModel, id),
    },
  },
  nominationId: {
    type: Schema.ObjectId,
    ref: 'Nomination',
  },
  numberOfPoints: Number,
});

NomineeSchema.index(
  {
    userId: 1,
    nominationId: 1,
  },
  {
    unique: true,
  },
);

// NomineeSchema.pre('insertMany', insertMany);

module.exports = mongoose.model('Nominee', NomineeSchema);
