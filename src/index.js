import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './services/mongodb/connectDB';
dotenv.config('./.env');
import userRoutes from './routes/user'
import categoryRoutes from './routes/category'
import productRoutes from './routes/product'
import addressRoutes from './routes/address'

const app = express();

const PORT = process.env.PORT || 8080

connectDB();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/address', addressRoutes);

app.get('/', (req,res)=>{
    res.send(`server Deployed by github actions ${PORT}`)
})

app.listen(PORT, ()=>{
    console.log(`Server listening on PORT ${PORT}`)
})