import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connects to local MongoDB, creating 'salesdb' if it doesn't exist
    await mongoose.connect('mongodb://127.0.0.1:27017/salesdb');
    console.log('MongoDB Connected to salesdb...');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

export default connectDB;