// core node modules

// 3rd party modules
const mongoose = require('mongoose');

// internal modules

const { Schema } = mongoose;

const NominationSchema = Schema({
  nominatedBy: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  nominee: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category',
  },
  numberOfPoints: Number,
  __v: { type: Number, select: false },
});

module.exports = mongoose.model('Nomination', NominationSchema);
