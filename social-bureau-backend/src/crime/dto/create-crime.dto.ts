import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentChannels } from '../models/payment-channel.enum';
import { Type, TypeHelpOptions } from 'class-transformer';
export class CreateCrimeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  mobilePhone: string;

  @IsNotEmpty()
  @IsString()
  cId: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  subcategory: string;

  @IsNotEmpty()
  @IsString()
  foundOn: string;

  @IsNotEmpty()
  @IsArray()
  evidences: [];

  @IsNotEmpty()
  @IsString()
  transcationDate: string;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  amountOfMoney: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  scamType: string;
}

export class ChannelBankTransferInputType {
  @IsNotEmpty()
  @IsString()
  bank: string;
}

export class ChannelCreditCardInputType {
  @IsNotEmpty()
  @IsString()
  network: string;

  @IsNotEmpty()
  @IsString()
  issuers: string;

  @IsNotEmpty()
  @IsString()
  number: string;
}

export class ChannelElectronicPaymentInputType {
  @IsNotEmpty()
  @IsString()
  payment: string;
}

export class ChannelCryptocurrencyInputType {
  @IsNotEmpty()
  @IsString()
  walletName: string;

  @IsNotEmpty()
  @IsString()
  walletAddress: string;
}

export class ChannelOtherInputType {
  @IsNotEmpty()
  @IsString()
  channel: string;
}
