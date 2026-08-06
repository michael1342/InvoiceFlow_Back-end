import express, { type Request, type Response, type Application } from "express";
const app: Application = express();
app.use(express.json());
const connectDB = require("./config/db");
const AuthRoute = require("./routes/auth.routes");
const PaymentRoute = require("./routes/payment.routes");
const superAdmin = require("./routes/superAdmin.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const dotenv = require('dotenv').config();
const cookies = require('cookie-parser');
const { PRODUCT_STATUS } = require('./config/constants');
const cors = require('cors');

const allowedOrigins = ['http://localhost:5173' , 'http://localhost:5174' , 'http://localhost:5175' , 'http://localhost:5176' , 'http://localhost:5177' , 'http://localhost:5178' , 'http://localhost:5179'];

app.use(cors({
    origin: 'http://localhost:5173',
    headers: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(cookies());

const PORT = process.env.PORT || 8080;

connectDB();
app.use('/api/auth', AuthRoute);
app.use('/api/payment', PaymentRoute);
app.use('/api/teams', superAdmin);
app.use('/api/inventory', inventoryRoutes);


// app.use('/api/customers', customerRoutes);
// app.use(`/:${id}`, customerRoutes);

// const getProductStatus = (quantity: number): string => {
//     if (quantity === 0) {
//         return PRODUCT_STATUS.OUT_OF_STOCK
//     } else if (quantity <= 30) {
//         return PRODUCT_STATUS.LOW_STOCK
//     } else {
//         return PRODUCT_STATUS.IN_STOCK
//     }
// }

// console.log(getProductStatus(10)); // Output: "out_of_stock"

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});