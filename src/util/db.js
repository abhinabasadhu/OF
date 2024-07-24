// server/db.js
import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017';
const dbName = 'todoList';
let db = null;

async function connectToDB() {
  if (db) return db;

  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);
  return db;
}

export default connectToDB