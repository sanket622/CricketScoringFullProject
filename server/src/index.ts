import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URL 

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

import matchRoutes from './routes/matchRoutes';

app.use('/api/match', matchRoutes);

app.get('/', (req, res) => {
  res.send('Cricket Scoring API Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
