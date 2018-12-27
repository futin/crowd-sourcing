// core modules

// 3rd party modules
const { argv } = require('yargs');

// internal alias modules

// internal modules
const scriptRunner = require('./script-runner');

const {
  NODE_ENV: environment = 'dev',
  MONGODB_SERVER_URL: url,
} = argv;
const { log } = console;

const buildListOfPromises = (items, method) => items.map(item => method(item));

const deleteAllCollections = [
  {
    dbName: `crowd-source-${environment}`,
    collectionName: '',
    // create admin user
    action: async (dbInstance) => {
      const collections = await dbInstance.listCollections().toArray();

      const dropCollectionByName = (collectionName) => {
        log('Dropping collection', collectionName);
        return dbInstance.dropCollection(collectionName);
      };

      return Promise.all(buildListOfPromises(collections.map(collection => collection.name), dropCollectionByName));
    },
  },
];

module.exports = scriptRunner(deleteAllCollections, url)
  .then(() => (log('All collections dropped!'), process.exit())) // eslint-disable-line no-sequences
  .catch(err => log(err));
