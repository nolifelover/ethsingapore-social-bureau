import { FormControl, FormGroup } from "@angular/forms";
import { PageInfo, Time } from "./common.type";
import { ReportComment } from "./comment.type";
import { User } from "./auth.type";

export type ReportInputType = {
  title: string;
  description: string;
  name: string;
  mobilePhone: string;
  cId: string;
  scamType: string;
  category: string;
  subcategory: string;
  foundOn: string;
  evidences: string[];
  transcationDate: string;
  paymentChannel: string;
  paymentDetail: any; // eslint-disable-line
  amountOfMoney: string;
  currency: string;
};

export type ReportFormType = {
  title: FormControl<string>;
  description: FormControl<string>;
  name: FormControl<string>;
  mobilePhone: FormControl<string>;
  cId: FormControl<string>;
  scamType: FormControl<string>;
  category: FormControl<string>;
  subcategory: FormControl<string>;
  foundOn: FormControl<string>;
  evidences: FormControl<string[]>;
  transcationDate: FormControl<string>;
  paymentChannel: FormControl<string>;
  paymentDetail?: FormGroup;
  amountOfMoney: FormControl<string>;
  currency: FormControl<string>;
};

export type CategoryType = {
  title: string;
  subcategories: string[];
};

export type PaymentDetail =
  | ChannelBankTransferInputType
  | ChannelCreditCardInputType
  | ChannelElectronicPaymentInputType
  | ChannelCryptocurrencyInputType
  | ChannelOtherInputType;

export type PaymentDetailFormGroup =
  | ChannelBankTransferFormType
  | ChannelCreditCardFormType
  | ChannelElectronicPaymentInputForm
  | ChannelCryptocurrencyInputForm
  | ChannelOtherFormType;

// Channel Bank Transfer

export type ChannelBankTransferInputType = {
  bank: string;
};

export type ChannelBankTransferFormType = {
  bank: FormControl<string>;
};

// Credit Card

export type ChannelCreditCardInputType = {
  otherNetwork?: string;
  network: string;
  issuers: string;
  number: string;
};

export type ChannelCreditCardFormType = {
  otherNetwork?: FormControl<string>;
  network: FormControl<string>;
  issuers: FormControl<string>;
  number: FormControl<string>;
};

// Electronic Payment

export type ChannelElectronicPaymentInputType = {
  payment: string;
  other?: string;
};

export type ChannelElectronicPaymentInputForm = {
  payment: FormControl<string>;
  other?: FormControl<string>;
};

// Cryptocurrency

export type ChannelCryptocurrencyInputType = {
  walletName: string;
  walletAddress: string;
};

export type ChannelCryptocurrencyInputForm = {
  walletName: FormControl<string>;
  walletAddress: FormControl<string>;
};

// Channel Other

export type ChannelOtherInputType = {
  channel: string;
};

export type ChannelOtherFormType = {
  channel: FormControl<string>;
};

export type ReportResult = ReportInputType & {
  createdBy: User;
  id: string;
  updatedAt: Time;
  createdAt: Time;
  upvote: number;
  downvote: number;
  votes: string[];
  upvoter: boolean;
  downvoter: boolean;
  countComment: number;
  scamType: string;
};

export type ReportPayloadWithPageInfo = PageInfo & {
  results: ReportResult[];
};

export type ReportDetail = ReportResult & {
  comments: ReportComment[];
};
