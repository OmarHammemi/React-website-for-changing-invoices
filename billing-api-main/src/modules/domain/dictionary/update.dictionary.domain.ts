import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDictionaryDomain {

  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  dictionary: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  shortValue: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  icon: string;

  @IsString()
  @IsOptional()
  data: string;

  @IsNumber()
  @IsOptional()
  parent: number;


}
