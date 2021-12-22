import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';




export class UpdateItemDomain {


  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  idInvoice: number;




}
