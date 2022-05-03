import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './services/models/connectDB';
dotenv.config('./.env');

const app = express();

const PORT = process.env.PORT || 8080

connectDB();

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})
