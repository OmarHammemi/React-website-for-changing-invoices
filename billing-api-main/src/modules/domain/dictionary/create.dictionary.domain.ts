import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { DictionaryTypeEnum } from './dictionary.type.enum';

export class CreateDictionaryDomain {

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
