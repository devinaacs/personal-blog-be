import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from "class-validator";

const BLOCK_TYPES = ["paragraph", "heading", "list", "quote"] as const;
type BlockType = (typeof BLOCK_TYPES)[number];

export class ContentBlockDto {
  @ApiProperty({ example: "paragraph", enum: BLOCK_TYPES })
  @IsIn(BLOCK_TYPES)
  type!: BlockType;

  @ApiPropertyOptional({ example: "It was a dark and stormy night." })
  @ValidateIf((block: ContentBlockDto) =>
    ["paragraph", "heading", "quote"].includes(block.type),
  )
  @IsString()
  @MaxLength(2000)
  text?: string;

  @ApiPropertyOptional({ example: "Someone smarter than me" })
  @ValidateIf((block: ContentBlockDto) => block.type === "quote")
  @IsOptional()
  @IsString()
  @MaxLength(120)
  author?: string;

  @ApiPropertyOptional({ type: [String] })
  @ValidateIf((block: ContentBlockDto) => block.type === "list")
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  items?: string[];
}
