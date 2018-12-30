// node core modules

// 3rd party modules

// internal alias modules
const {
  mongodb: {
    connector: { executeDbMethod },
  },
} = require('@databases');
const {
  constants: { roles },
  settings: {
    nominationConfig: { numberOfPointsPerMonth },
  },
} = require('@config');

// internal modules

const userService = {
  findOrCreateUser(user) {
    const { displayName: fullName, emails, photos = [] } = user;
    const [email] = emails;
    const [photo] = photos;

    // fetch username from the email, so it can be easily searchable
    const username = this.fetchUsernameByEmail(email);

    // extract the image url from the google API
    const imageUrl = photo ? photo.value : '';

    const userData = {
      username,
      fullName,
      imageUrl,
      isActive: true,
      email: email.value,
      role: roles.USER,
      pointsToAssign: numberOfPointsPerMonth,
    };

    return executeDbMethod('User', 'findOrCreate', userData);
  },
  isUserAuthorized: username => executeDbMethod('AuthUser', 'findOne', { username }),
  fetchUsernameByEmail: email => email.value.split('@')[0],
};

module.exports = userService;
