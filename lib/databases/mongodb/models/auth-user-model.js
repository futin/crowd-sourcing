// node core modules

// 3rd party modules
const mongoose = require('mongoose');

// internal alias modules

// internal modules

const { Schema } = mongoose;

const AuthUserSchema = Schema({
  username: { type: String, unique: true, required: true },
});

module.exports = mongoose.model('AuthUser', AuthUserSchema);
