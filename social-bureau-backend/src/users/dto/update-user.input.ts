import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';
import { Provider } from '../models/provider.enum';
import { Role } from '../models/role.enum';

export class UpdateUserInput {

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

  @IsOptional()
  role: Role;

  @IsOptional()
  nonce: number;
}
