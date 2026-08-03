import express, {type Request, type Response, type Application }  from "express";
import authRouter from './routes/auth.routes';
import dotenv from 'dotenv';
import { connectDB } from "./config/db";
import invoiceRouter from '../src/routes/invoices.routes'
const app: Application = express();
const PORT:number = 5000;


connectDB();
app.use(express.json());

app.use('/api/v1/invoicenumber',invoiceRouter)
app.use('/api/v1', authRouter);
app.listen(PORT, () => {
    console.log(` server is running at http://localhost: ${PORT}/`);
});