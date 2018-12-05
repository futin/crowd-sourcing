'use strict';

// node core modules

// 3rd party modules
const mongoose = require('mongoose');

// internal modules

const { Schema } = mongoose;

const AuthUserSchema = Schema({
  username: String,
  __v: { type: Number, select: false },
});

AuthUserSchema.index({ username: 1 });

module.exports = mongoose.model('AuthUser', AuthUserSchema);
