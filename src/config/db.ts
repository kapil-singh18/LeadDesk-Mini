import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<void> {
  // Disable mongoose auto-indexing in production for performance if needed
  mongoose.set('strictQuery', true);

  if (config.mongoUri) {
    try {
      console.log('Attempting connection to configured MONGODB_URI...');
      await mongoose.connect(config.mongoUri);
      console.log('Successfully connected to MongoDB Atlas / Remote Database.');
      return;
    } catch (error) {
      console.warn('Failed to connect to MONGODB_URI, falling back to In-Memory MongoDB:', error);
    }
  }

  // Fallback to Mongo Memory Server for standalone preview
  try {
    console.log('Starting In-Memory MongoDB Server...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB successfully.');
  } catch (err) {
    console.error('Fatal: Could not initialize MongoDB database:', err);
    throw err;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
