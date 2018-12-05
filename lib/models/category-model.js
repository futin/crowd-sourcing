'use strict';

// core node modules

// 3rd party modules
const mongoose = require('mongoose');

// internal modules
const { Schema } = mongoose;

const CategorySchema = Schema({
  name: String,
  description: String,
  __v: { type: Number, select: false },
});

CategorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', CategorySchema);
