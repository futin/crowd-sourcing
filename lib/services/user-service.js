// node core modules

// 3rd party modules

// internal modules
const User = require('../database/models/user-model');
const AuthUser = require('../database/models/auth-user-model');

const userService = {
  findOrCreateUser(user) {
    const { displayName: fullName, emails } = user;
    const [email] = emails;

    return User.findOrCreate({ email: email.value, fullName });
  },
  isUserAuthorized: username => AuthUser.findOne({ username }),
};

module.exports = userService;
