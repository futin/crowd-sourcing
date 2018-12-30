// core modules

// 3rd party modules
const { connect } = require('mongodb').MongoClient;

// internal alias modules

// internal modules

const { log } = console;

const runScripts = (scripts, url) =>
  scripts.reduce(
    (series, {
      dbName, collectionName, query, findAndUpdate, action,
    }) =>
      series.then(() =>
        connect(url)
          .then((client) => {
            log('Connected to', url);

            const dbInstance = client.db(dbName);

            // if collectionName is not provided, just return db instance
            if (!collectionName) {
              return Promise.resolve(action(dbInstance));
            }

            const collection = dbInstance.collection(collectionName);

            // recursive-promise function that iterates over each cursor and performs
            // a provided function, only required for migrations
            if (findAndUpdate) {
              const cursor = collection.find(query);

              const next = () =>
                cursor.next().then((doc) => {
                  if (!doc) return client.close();
                  log(`Find and update on ${dbName} - ${collectionName} ${doc._id}`);
                  return action(collection, doc, dbInstance).then(next);
                });

              return next();
            }

            return Promise.resolve(action(collection, dbInstance));
          })
          .then(() => log('Done!'))
          .catch(err => log(err))),
    Promise.resolve(),
  );

module.exports = runScripts;
