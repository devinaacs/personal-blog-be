import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CreateTagDto {
  @ApiProperty({ example: "nestjs" })
  @IsString()
  @MaxLength(50)
  name!: string;
}
