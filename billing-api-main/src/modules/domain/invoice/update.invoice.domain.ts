import {
  IS_ARRAY,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Item } from '../../item/item.entity';




export class UpdateInvoiceDomain {


  @IsNumber()
  @IsOptional()
  id: number;

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

  @IsArray()
  items: [Item];

}
