import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const DBSTRING =process.env.DBSTRING;

 export const connectDB = async ():Promise<void> => {
     if(!DBSTRING) throw new Error('DBSTRING is missing from the .env file.');
    try{
        console.log('connecting to invoiceflowDB ...');
        await mongoose.connect(DBSTRING,{});
        console.log('connected to invoiceflowDB✅');
    }catch(err){
        console.error("Error connecting to InvoiceFlowdb:",err);
        process.exit(1)
    }
}
