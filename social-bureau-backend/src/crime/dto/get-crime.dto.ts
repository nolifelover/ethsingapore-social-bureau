import { IsOptional } from 'class-validator';
export class CrimesListDto {
  @IsOptional()
  name: string;
  @IsOptional()
  mobilePhone: string;
  @IsOptional()
  cId: string;
  @IsOptional()
  bank: string;
  @IsOptional()
  scamType: string;
  @IsOptional()
  walletAddress: string;
  @IsOptional()
  orderBy: string;
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
}
export class CrimesListByScamTypeDto {
  @IsOptional()
  scamType: string;
  @IsOptional()
  orderBy: string;
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
}
