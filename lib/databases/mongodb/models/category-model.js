// core node modules

// 3rd party modules
const mongoose = require('mongoose');

// internal alias modules

// internal modules

const { Schema } = mongoose;

const CategorySchema = Schema({
  name: { type: String, unique: true, required: true },
  description: String,
});

module.exports = mongoose.model('Category', CategorySchema);
