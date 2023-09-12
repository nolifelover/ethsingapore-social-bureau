import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from '../models/type.enum';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  crimeId: string;

  @IsOptional()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(Type)
  vote: Type;

  @IsOptional()
  @IsArray()
  evidences: [];
}
