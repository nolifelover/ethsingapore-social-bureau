import { Time } from "@angular/common";
import { NestHttpException } from "./common.type";
import { FormControl } from "@angular/forms";

export interface CommonAuthResponse {
  status: number;
  message: string;
  data: SinginRespData | AuthRespData | NestHttpException | null;
}

export type SinginRespData = {
  nonce: number;
  msg: string;
};

export type AuthRespData = {
  user: User;
  tokens: JwtToken;
};

export type JwtToken = {
  accessToken: string;
  refreshToken: string;
};

export interface User {
  uid: string;
  createdAt: Time;
  name: string;
  publicAddress: string;
  email: string;
  updatedAt: Time;
  power: number;
  role: string;
  nonce: number;
  mobilePhone?: string;
  profileImage?: string;
  firstname?: string;
  lastname?: string;
  interestingScamType?: string[];
}

export enum Provider {
  EMAIL = "email",
  MOBILE_PHONE = "mobilePhone",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  APPLE = "apple",
  METAMASK = "metamask",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  INSPECTOR = "INSPECTOR",
}

export type UserProfileInputType = {
  mobilePhone: string;
  profileImage: string;
  firstname: string;
  lastname: string;
  email: string;
  interestingScamType: string[];
};

export type UserProfileFormType = {
  mobilePhone: FormControl<string>;
  profileImage: FormControl<string>;
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  interestingScamType: FormControl<string[]>;
};
