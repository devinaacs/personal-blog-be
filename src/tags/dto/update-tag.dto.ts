import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateTagDto {
  @ApiPropertyOptional({ example: "nestjs" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;
}
