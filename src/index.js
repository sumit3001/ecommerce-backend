import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './services/mongodb/connectDB';
dotenv.config('./.env');
import userRoute from './routes/user'

const app = express();

const PORT = process.env.PORT || 8080

connectDB();

app.use(express.json());
app.use('/user', userRoute);

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})