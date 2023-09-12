import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '../models/role.enum';
import { Provider } from '../models/provider.enum';

export class CreateUserInput {

  @IsOptional()
  name: string;

  @IsOptional()
  @IsMobilePhone()
  mobilePhone: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  firstname: string;

  @IsOptional()
  lastname: string;

  @IsOptional()
  profileImage: string;

  @IsOptional()
  interestingScamType: string[];

  @IsNotEmpty()
  role: Role;
}
