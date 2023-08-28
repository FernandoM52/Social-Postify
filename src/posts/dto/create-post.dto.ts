import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrUpdatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  image: string;
}
