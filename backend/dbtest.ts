import connectDB from './database';

const uri = process.env.MONGO_URI;

connectDB();