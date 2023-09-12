import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "../models/type.enum";

export class CreateUserHistoryDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsNumber()
  power: number;

  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;

  @IsOptional()
  @IsString()
  refId?: string;

  @IsOptional()
  @IsString()
  crimeId: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  transaction?: string;
}

