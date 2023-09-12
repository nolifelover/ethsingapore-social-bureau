import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from '../models/type.enum';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  crimeId: string;

  @IsOptional()
  @IsString()
  createdBy: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(Type)
  vote: Type;

  @IsOptional()
  @IsArray()
  evidences: [];
}
