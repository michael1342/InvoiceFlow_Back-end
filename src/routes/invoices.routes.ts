import { Router } from "express";
import ctrl from '../controllers/invoice.controller'
const router = Router();

router.post("/:businessId", ctrl.testCreateInvoice);

export default router;