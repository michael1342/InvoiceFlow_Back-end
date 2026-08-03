import {STATUS} from '../constants/invoiceStatus';
import invoice from '../models/invoice';
import businesses from '../models/business'; 
import product from '../models/product'
import api from '../utils/responses'
import{Response } from 'express';
import generateBusinessInitial from '../utils/businessInitial';
import getNextInvoiceSequence from '../services/getNextSequence.service';
import formatInvoiceNumber from '../utils/invoiceNumber';
// create a business invoice 
export const createInvoice = async (businessId:string):Promise<string>=>{
  console.log("Business ID:", businessId);

const business = await businesses.findById(businessId);

console.log("Business:", business);
if (!business) {
    throw new Error("Business not found");
}

const initials = generateBusinessInitial(business.name);

const year = new Date().getFullYear();

const sequence = await getNextInvoiceSequence(
    business._id.toString()
);

const invoiceNumber = formatInvoiceNumber(
    initials,
    year,
    sequence
);

return invoiceNumber;
}

