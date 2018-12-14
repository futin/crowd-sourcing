// core node modules

// 3rd party modules
const mongoose = require('mongoose');

// internal alias modules

// internal modules

const { Schema } = mongoose;

const NomineeSchema = Schema({
  categoryId: {
    type: Schema.ObjectId,
    ref: 'Category',
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  nominationId: {
    type: Schema.ObjectId,
    ref: 'Nomination',
  },
  numberOfPoints: Number,
});

NomineeSchema.index({
  userId: 1,
  nominationId: 1,
}, {
  unique: true,
});

module.exports = mongoose.model('Nominee', NomineeSchema);
