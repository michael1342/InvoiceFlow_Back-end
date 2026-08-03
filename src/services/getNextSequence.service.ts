import Counter from "../models/counter";

const getNextInvoiceSequence = async (
    businessId: string
): Promise<number> => {
    const counter = await Counter.findOneAndUpdate(
        { business: businessId },
        {
            $inc: {
                invoiceSequence: 1,
            },
        },
        {
            new: true,
            upsert: true,
        }
    );
    if(!counter){
        throw new Error("Failed to generate invoice sequence.")
    }

    return counter.invoiceSequence;
};

export default getNextInvoiceSequence;