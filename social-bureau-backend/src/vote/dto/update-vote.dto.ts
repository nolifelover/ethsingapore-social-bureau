import { IsOptional, IsString } from 'class-validator';

export class UpdateVoteDto {
  @IsOptional()
  @IsString()
  crimeId: string;

  @IsOptional()
  @IsString()
  point: string;

  @IsOptional()
  @IsString()
  createdUserId: string;
}
