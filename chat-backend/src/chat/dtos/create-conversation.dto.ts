import { IsArray, IsInt } from "class-validator";

export class CreateConversationDto {
  @IsArray()
  @IsInt({ each: true })
  receiverId: number;
}
