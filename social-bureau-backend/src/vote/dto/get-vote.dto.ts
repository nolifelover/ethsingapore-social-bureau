import { IsOptional } from "class-validator";

export class VotesListDto {
  @IsOptional()
  crimeId: string;
  @IsOptional()
  createdUserId: string;
  @IsOptional()
  orderBy: string;
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
}
