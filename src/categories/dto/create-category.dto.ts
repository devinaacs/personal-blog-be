import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "engineering" })
  @IsString()
  @MaxLength(100)
  name!: string;
}
