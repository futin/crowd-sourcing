// core node modules

// 3rd party modules
const mongoose = require('mongoose');

// internal alias modules

// internal modules

const { Schema } = mongoose;

const NominationSchema = Schema({
  nominatedById: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  nomineeId: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  categoryId: {
    type: Schema.ObjectId,
    ref: 'Category',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  numberOfPoints: Number,
});

module.exports = mongoose.model('Nomination', NominationSchema);
