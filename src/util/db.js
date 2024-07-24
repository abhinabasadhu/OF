import { MongoClient } from "mongodb";

// MongoDB connection URI
const url = 'mongodb://localhost:27017';
// Database name
const dbName = 'todoList';
let db = null;

/**
 * Connect to the MongoDB database
 * @returns {Promise<Db>} The MongoDB database instance
 */
async function connectToDB() {
  // Return existing database connection if already established
  if (db) return db;
  
  // Create a new MongoClient instance with the connection URI
  const client = new MongoClient(url);

  // Connect to the MongoDB server
  await client.connect();

  // Select the database by name
  db = client.db(dbName);

  // Return the database instance
  return db;
}

// Export the connectToDB function as the default export
export default connectToDB;
