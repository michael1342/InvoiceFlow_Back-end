import { Request, Response } from "express";
import { createInvoice } from "../services/invoice.service";
import responses from '../utils/responses';
export const testCreateInvoice = async (
    req: Request,
    res: Response
) => {
    try {
        const { businessId } = req.params;
        if (!businessId) {
            return responses.error(
                res,
                "Business ID is required",
                400
            );
        }

        const invoiceNumber = await createInvoice(businessId);

        responses.success(res, { invoiceNumber }, "Invoice created successfully", 201);

    } catch (error) {

        responses.error(
            res,
            error instanceof Error
                ? error.message
                : "Failed to create invoice",
            500
        );

    }
};

exports.default = { testCreateInvoice };