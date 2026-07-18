import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsArray,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

import { ContentBlockDto } from "./content-block.dto";

export class CreatePostDto {
  @ApiProperty({ example: "the todo app paradox" })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: "the-todo-app-paradox",
    description: "Leave blank to auto-generate from the title",
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @ApiProperty({ example: "006" })
  @IsString()
  @MaxLength(10)
  number!: string;

  @ApiPropertyOptional({ example: "2026-01-16T00:00:00.000Z" })
  @IsOptional()
  @IsISO8601()
  publishedAt?: string;

  @ApiPropertyOptional({
    example: "Why finishing your to-do list isn't the point.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string;

  @ApiProperty({ type: [ContentBlockDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  content!: ContentBlockDto[];

  @ApiProperty({ example: "cmr7z6zoo0004ipb9rth3ia1a" })
  @IsString()
  categoryId!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}
