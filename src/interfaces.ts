export interface User{
Id:string;
name:string;
email:string;
password:string;
company_name:string;
account_Type:'Business Owner'|'System Admin Portal'|'Accoutant Ledger' |'Inventory Manager';
}
export interface IDatabaseService{
     findUserByPassword():Promise<User>
     
}