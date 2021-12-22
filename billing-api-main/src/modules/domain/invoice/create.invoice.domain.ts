import { Column } from 'typeorm';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';



export class CreateInvoiceDomain {
  @IsString()
  @IsNotEmpty()
  invoiceno: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  taxrate: number;

  @IsDateString()
  @IsNotEmpty()
  issuedate: Date;

  @IsDateString()
  @IsNotEmpty()
  duedate: Date;

  @IsString()
  @IsNotEmpty()
  note: string;

  @IsNumber()
  @IsNotEmpty()
  taxamount: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsNumber()
  @IsNotEmpty()
  amountpaid: number;

  @IsDateString()
  @IsOptional()
  updatedAt: Date;

  @IsString()
  @IsOptional()
  updatedBy: number;

  @IsDateString()
  @IsOptional()
  createdAt: Date;

  @IsString()
  @IsOptional()
  createdBy: number;
}
