import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString } from "class-validator";

export class CreateUserReportPointDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsNumber()
  point: number;

  @IsNotEmpty()
  @IsString()
  crimeId: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  isEnd: number;
}
