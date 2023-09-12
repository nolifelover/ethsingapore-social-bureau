import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from '../models/type.enum';

export class UpdateUserHistoryDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsOptional()
  @IsNumber()
  power?: number;

  @IsOptional()
  @IsEnum(Type)
  type?: Type;

  @IsOptional()
  @IsString()
  refId?: string;

  @IsOptional()
  @IsString()
  crimeId?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  transaction?: string;
}
