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

app.use(cookies());

const PORT = process.env.PORT || 8080;

connectDB();
app.use('/api/auth', AuthRoute);
app.use('/api/payment', PaymentRoute);
app.use('/api/teams', superAdmin);
app.use('/api/inventory', inventoryRoutes);

const getProductStatus = (quantity: number) => {
    if(quantity === 0) {
        return PRODUCT_STATUS.OUT_OF_STOCK
    } 
    if(quantity <= 30) {
        return PRODUCT_STATUS.LOW_STOCK
    }
    return PRODUCT_STATUS.IN_STOCK
}
console.log(getProductStatus(0)); // Output: "out_of_stock"

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