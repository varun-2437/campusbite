import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusbite';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] MongoDB Connected successfully to ${uri}`);
    return true;
  } catch (err) {
    console.warn(`[Database] MongoDB connection skipped or offline (${err.message}). Using hybrid in-memory fallbacks.`);
    return false;
  }
};
