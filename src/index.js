import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './services/mongodb/connectDB.js';
dotenv.config('./.env');
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import addressRoutes from './routes/address.js';
import orderRoutes from './routes/order.js';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 8080

connectDB();

app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/address', addressRoutes);
app.use('/order', orderRoutes);

app.get('/', (req,res)=>{
    res.send(`server Deployed at ${PORT}`)
})

app.listen(PORT, ()=>{
    console.log(`Server listening on PORT ${PORT}`)
})