import { IsOptional } from "class-validator";
import { Type } from "../models/type.enum";

export class UserHistoriesListDto {
  @IsOptional()
  type: Type;
  @IsOptional()
  crimeId: string;
  @IsOptional()
  action: string;
  @IsOptional()
  orderBy: string;
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
}
