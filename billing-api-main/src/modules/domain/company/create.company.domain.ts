import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateCompanyDomain {

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


  /* Auditable data */
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
