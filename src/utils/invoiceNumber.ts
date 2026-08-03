const formatInvoiceNumber = (
    initials: string,
    year: number,
    sequence: number
): string => {
    const paddedSequence = sequence.toString().padStart(6, "0");

    return `${initials}-"INV"-${year}-${paddedSequence}`;
};

export default formatInvoiceNumber;