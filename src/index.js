import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './services/connectDB';
dotenv.config('./.env');
import authRoutes from './routes/auth'

const app = express();

const PORT = process.env.PORT || 8080

connectDB();

app.use(express.json());
app.use('/user', authRoutes);

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})
