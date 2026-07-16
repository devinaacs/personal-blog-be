import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class UpdatePostDto {
  @ApiPropertyOptional({ example: "the todo app paradox" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    example: "the-todo-app-paradox",
    description: "Leave blank to auto-generate from the title",
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @ApiPropertyOptional({ example: "006" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  number?: string;

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

  @ApiPropertyOptional({ example: "The uncomfortable truth" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subheading?: string;

  @ApiPropertyOptional({ example: "A memorable pull quote." })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  quote?: string;

  @ApiPropertyOptional({ example: "Someone smarter than me" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  quoteAuthor?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  paragraphs?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  list?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: "Up to 3 posts may be pinned at once",
  })
  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

  @ApiPropertyOptional({ example: "cmr7z6zoo0004ipb9rth3ia1a" })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}
