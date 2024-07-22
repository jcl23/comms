import { MongoClient } from 'mongodb';
import fs from 'fs';
import { UtilThrowModel } from "../backend/models/throws";
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_URI;
const dataSource = process.env.DATA_SOURCE || '../../../scraping/flatFullData.json';

async function run() {
  const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('instructions'); // Replace with your database name
    const collection = database.collection('utilthrows');
    // delete all, first
    await collection.deleteMany({});
    console.log('Deleted all documents');
    const jsonData = await fs.promises.readFile(dataSource, 'utf8');
    const throws = JSON.parse(jsonData);

    const result = await collection.insertMany(throws);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error('Error inserting document:', err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
