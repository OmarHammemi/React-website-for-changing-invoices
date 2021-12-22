import { IsNotEmpty } from 'class-validator';

export class LoginDomain {

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
