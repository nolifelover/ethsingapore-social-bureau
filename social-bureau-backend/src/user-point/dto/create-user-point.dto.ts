import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString } from "class-validator";

export class CreateUserPointDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsNumber()
  point: number;
}
