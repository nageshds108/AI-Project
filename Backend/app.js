import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import interviewRoutes from './routes/interviewRoutes.js';
dotenv.config();





const app = express();
app.use(cors(
  {origin: 'http://localhost:5173', 
  credentials: true, 
}
));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const Mongo_Url = process.env.Mongo_Url;

const dbConnect = async () => {
  try {
    await mongoose.connect(Mongo_Url);  
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};


dbConnect();
