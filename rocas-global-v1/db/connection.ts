import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import Constants from "expo-constants";

dotenv.config();

const uri = Constants.expoConfig.extra.MONGODB_URI;

let client: MongoClient;

export async function connectToDatabase() {
  if (client) {
    return client.db();
  }

  client = await MongoClient.connect(uri);
  return client.db();
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
  }
}
