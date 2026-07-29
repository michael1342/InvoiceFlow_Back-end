import express, {type Request, type Response, type Application }  from "express";
const app: Application = express();
app.use(express.json());
const connectDB = require("./config/db");
const AuthRoute = require("./routes/auth.routes");
const PaymentRoute = require("./routes/payment.routes");
const superAdmin = require("./routes/superAdmin.routes");
const dotenv = require('dotenv').config();
const cookies = require('cookie-parser');

app.use(cookies());

const PORT = process.env.PORT || 8080;

connectDB();
app.use('/api/auth', AuthRoute);
app.use('/api/payment', PaymentRoute);
app.use('/api/teams', superAdmin);
// app.use('/api/customers', customerRoutes);
// app.use(`/:${id}`, customerRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});