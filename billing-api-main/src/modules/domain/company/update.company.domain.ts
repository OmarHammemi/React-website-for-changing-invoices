import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDomain {

  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  siren: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  logoUrl: string;

  @IsString()
  @IsNotEmpty()
  email: string;


}
