// core modules

// 3rd party modules

// internal alias modules
const {
  settings: {
    environment,
    databases: {
      mongodb: { url: configMongoUrl },
    },
  },
} = require('../../../config');

// internal modules
const scriptRunner = require('./script-runner');

const { MONGO_SERVERS_PATH: serversPath } = process.env;
const { log } = console;
// if serversPath is provided, build the url. Otherwise just use the url from config
const url = serversPath ? `mongodb://${serversPath}` : configMongoUrl;

const insertScripts = [
  {
    dbName: `crowd-source-${environment}`,
    collectionName: 'categories',
    action: (collection) => {
      const categories = [
        { name: 'Machine', description: 'This is a machine category' },
        { name: 'Mom', description: 'This is a mom category' },
        { name: 'Scribe', description: 'This is a scribe category' },
        { name: 'Ninja', description: 'This is a ninja category' },
      ];

      return collection.insertMany(categories);
    },
  },
];

module.exports = scriptRunner(insertScripts, url)
  .then(() => (log('Categories inserted!'), process.exit())) // eslint-disable-line no-sequences
  .catch(err => log(err));
