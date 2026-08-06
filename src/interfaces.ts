export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: string;
  companyName: string
}

export interface Product {
    sku: string,
    name: string,
    businessID: string,
    category: string,
    unitCost: number,
    unitPrice: number,
    quantity: number
}