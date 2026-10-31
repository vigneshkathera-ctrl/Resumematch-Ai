import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumematch';

  if (uri.includes('<db_password>')) {
    console.warn('[Database Notice] MONGODB_URI contains placeholder "<db_password>".');
    console.log('[Database Notice] Operating in resilient in-memory storage mode. Replace "<db_password>" in server/.env with your actual Atlas password to persist to MongoDB.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.log('[Database Notice] Operating in resilient in-memory storage mode. Provide a valid MONGODB_URI in server/.env to persist to MongoDB.');
  }
};
