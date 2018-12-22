// run by mongoshell script
const conn = new Mongo();
const localDb = conn.getDB('local');
const { databases } = localDb.adminCommand('listDatabases');
databases.forEach((dbInfo) => {
  const { name } = dbInfo;
  if (!/^crowd-source/.test(name)) {
    return;
  }

  print(`dropping database ${name}`);
  const db = conn.getDB(name);
  db.dropDatabase();
});
