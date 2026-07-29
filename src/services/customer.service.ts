import express, {type Request, type Response, type Application }  from "express";
const app = express();
app.use(express.json());
import fs from "fs";
import path from "path";

const dataPath = path.join(__dirname, "../data/customers.json");
export class CustomerController {
    #customerService: string;
    constructor(customer: string) {
        this.#customerService = customer;
    }

    getCustomer = (): string => {
        return this.#customerService;
    }

    addCustomer = async (req: Request, res: Response): Promise<Response | void> => {
        try {
             const { name, email, totalSpent, unpaid, joinedDate } = req.body;
       if (!name || !email || !totalSpent || !unpaid || !joinedDate) {
        return res.status(400).json({ message: "All fields are required" });
       }

    const customers: any[] = [];

    if(!fs.existsSync(dataPath)) {
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    }
    
    const readData = fs.readFileSync(dataPath, "utf-8");
    const findUser = JSON.parse(readData).find((customer: any) => customer.email === email);

    if (findUser) {
        return res.status(400).json({ message: "customer already exists" });
    }
    // if (readData) {
    //     const parsedData = JSON.parse(readData);
    //     customers.push(...parsedData);
    // }

       const newCustomer = { id: Date.now(), name, email, totalSpent, unpaid, joinedDate };
       customers.push(newCustomer);
       fs.writeFileSync(dataPath, JSON.stringify(customers, null, 2), 'utf-8');
       
       return res.status(201).json({ message: "Customer added successfully" });
        } catch (error) {
          res.status(500).json({ message: "Internal server error", error: error });  
        }
    }

    deleteCustomer = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const customers = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
            const index = customers.find((customer: any) => customer.id === id);
            if (index === -1) {
                return res.status(404).json({ message: "Customer not found" });
            }
            customers.splice(index, 1);
            fs.writeFileSync(dataPath, JSON.stringify(customers, null, 2), 'utf-8');
            return res.status(200).json({ message: "Customer deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
            console.error(err);
        }
    }
}

module.exports = new CustomerController("customers");