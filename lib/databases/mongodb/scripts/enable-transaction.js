// run by mongoshell script
const conn = new Mongo();
const localDb = conn.getDB('local');
localDb.adminCommand({ setFeatureCompatibilityVersion: '4.0' });
