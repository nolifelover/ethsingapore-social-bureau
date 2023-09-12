import { Provider } from './provider.enum';
import { Role } from './role.enum';

export interface User {
  uid: string;
  profileName?: string;
  title?: string;
  bio?: string;
  provider?: Provider;
  email?: string;
  mobilePhone?: string;
  socialId?: string;
  firstname?: string;
  lastname?: string;
  profileImage?: string;
  role: Role;
  address?: string;
  power: number;

  /**
   * Signin with public address
   */
  publicAddress: string;
  nonce?: number;

  createdAt: Date;
  updatedAt: Date;
}
