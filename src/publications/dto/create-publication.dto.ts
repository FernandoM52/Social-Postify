import { IsDateString, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateOrUpdatePublicationDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  mediaId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  postId: number;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
