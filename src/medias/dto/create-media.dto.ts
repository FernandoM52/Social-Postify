import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrUpdateMediaDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
