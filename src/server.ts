import express, {type Request, type Response, type Application }  from "express";
const app: Application = express();
app.use(express.json());
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});