require('dotenv').config();

class PaymentService {
    #secret_key: any;
    #base_url: string;
    constructor() {
        this.#secret_key = process.env.PAYSTACK_SECRET_KEY
        this.#base_url = "https://api.paystack.co";
    }

    async initializeTransaction(email: string, amount: number, name: string, phone: string): Promise<any> {
    try {
      if (amount < 2000 || amount > 1000000) {
        throw new Error("Amount must be between 2000 and 1000000");
      }
    const response = await fetch(`${this.#base_url}/transaction/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.#secret_key}`,
      },
      body: JSON.stringify({ email, amount: amount * 100, first_name: name, phone }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(
        responseData.message || "Failed to initialize transaction",
      );
    }
    return responseData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

module.exports = new PaymentService()