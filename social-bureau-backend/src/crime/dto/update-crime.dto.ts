import { Type, TypeHelpOptions } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaymentChannels } from '../models/payment-channel.enum';

export class UpdateCrimeDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  mobilePhone: string;

  @IsOptional()
  @IsString()
  cId: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  subcategory: string;

  @IsOptional()
  @IsString()
  foundOn: string;

  @IsOptional()
  @IsString()
  evidences: string[];

  @IsOptional()
  @IsString()
  transcationDate: string;

  @IsOptional()
  @IsEnum(PaymentChannels)
  paymentChannel: PaymentChannels;

  @IsNotEmptyObject()
  @IsDefined()
  @Type((data: TypeHelpOptions) => {
    switch (data.object.paymentChannel) {
      case PaymentChannels.BANKTRANSFER:
        return ChannelBankTransferInputType;
      case PaymentChannels.CREDITCARD:
        return ChannelCreditCardInputType;
      case PaymentChannels.ELECTRONICPAYMENT:
        return ChannelElectronicPaymentInputType;
      case PaymentChannels.CRYPTOCURRENCY:
        return ChannelCryptocurrencyInputType;
      case PaymentChannels.OTHERS:
        return ChannelOtherInputType;
      default:
        return ChannelOtherInputType;
    }
  })
  @ValidateNested()
  paymentDetail: object;

  @IsOptional()
  @IsString()
  amountOfMoney: string;

  @IsOptional()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  comments: string[];

  @IsOptional()
  @IsString()
  votes: string[];

  @IsOptional()
  @IsString()
  scamType: string;
}

export class ChannelBankTransferInputType {
  @IsOptional()
  @IsString()
  bank: string;
}

export class ChannelCreditCardInputType {
  @IsOptional()
  @IsString()
  network: string;

  @IsOptional()
  @IsString()
  issuers: string;

  @IsOptional()
  @IsString()
  number: string;
}

export class ChannelElectronicPaymentInputType {
  @IsOptional()
  @IsString()
  payment: string;
}

export class ChannelCryptocurrencyInputType {
  @IsOptional()
  @IsString()
  walletName: string;

  @IsOptional()
  @IsString()
  walletAddress: string;
}

export class ChannelOtherInputType {
  @IsOptional()
  @IsString()
  channel: string;
}
