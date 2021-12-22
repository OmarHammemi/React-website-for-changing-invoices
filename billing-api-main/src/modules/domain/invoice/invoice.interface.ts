import { IsNotEmpty, IsString } from 'class-validator';


export interface InvoiceRep{
  id: number;
  invoiceno: string;
  description: string;
  taxrate: number;
  issuedate: Date;
  duedate: Date;
  note: string;
  taxamount: number;
  subtotal: number;
  total: number;
  status: boolean;
  updatedAt: Date;
  updatedBy: number;
  createdAt: Date;
  createdBy: number;

}
