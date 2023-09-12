import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from '../models/type.enum';

export class CreateVoteDto {
  @IsNotEmpty()
  @IsString()
  crimeId: string;

  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;

  @IsOptional()
  @IsString()
  point: string;

  @IsOptional()
  @IsString()
  createdBy: string;
}
