// node core modules

// 3rd party modules

// internal alias modules
const { mongodb: { connector: { execute, findOne } } } = require('@databases');
const { constants: { roles }, settings: { nominationConfig: { numberOfPointsPerMonth } } } = require('@config');

// internal modules

const userService = {
  findOrCreateUser(user) {
    const { displayName: fullName, emails } = user;
    const [email] = emails;
    // fetch username from the email, so it can be easily searchable
    const username = this.fetchUsernameByEmail(email);

    const userData = {
      username,
      fullName,
      email: email.value,
      role: roles.user,
      pointsToAssign: numberOfPointsPerMonth,
    };

    return execute('User', 'findOrCreate', userData);
  },
  isUserAuthorized: username => findOne('AuthUser', { username }),
  fetchUsernameByEmail: email => email.value.split('@')[0],
};

module.exports = userService;
