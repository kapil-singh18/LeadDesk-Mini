import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (config.mongoUri) {
    try {
      console.log('Attempting connection to configured MONGODB_URI...');
      await mongoose.connect(config.mongoUri);
      console.log('Successfully connected to MongoDB Atlas / Remote Database.');
      return;
    } catch (error) {
      console.warn('Failed to connect to MONGODB_URI, checking fallback options:', error);
      if (config.nodeEnv === 'production') {
        throw error;
      }
    }
  }

  // Fallback to In-Memory MongoDB for development/testing
  console.log('Starting In-Memory MongoDB Server...');
  mongoMemoryServer = await MongoMemoryServer.create();
  const uri = mongoMemoryServer.getUri();
  await mongoose.connect(uri);
  console.log('Connected to In-Memory MongoDB successfully.');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
