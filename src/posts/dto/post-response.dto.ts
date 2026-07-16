import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { CategoryResponseDto } from "@/categories/dto/category-response.dto";
import { PaginationMetaDto } from "@/common/dto/pagination-meta.dto";
import { TagResponseDto } from "@/tags/dto/tag-response.dto";

export class PostResponseDto {
  @ApiProperty({ example: "cmr7z6zoo0004ipb9rth3ia1a" })
  id!: string;

  @ApiProperty({ example: "the-myth-of-clean-code" })
  slug!: string;

  @ApiProperty({ example: "the myth of clean code" })
  title!: string;

  @ApiProperty({ example: "003" })
  number!: string;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  publishedAt!: Date;

  @ApiPropertyOptional({
    example: "Why finishing your to-do list isn't the point.",
    nullable: true,
  })
  excerpt!: string | null;

  @ApiPropertyOptional({
    example: "Good enough is often good enough",
    nullable: true,
  })
  subheading!: string | null;

  @ApiPropertyOptional({
    example: "Premature optimization is the root of all evil.",
    nullable: true,
  })
  quote!: string | null;

  @ApiPropertyOptional({ example: "Donald Knuth", nullable: true })
  quoteAuthor!: string | null;

  @ApiProperty({ type: [String] })
  paragraphs!: string[];

  @ApiProperty({ type: [String] })
  list!: string[];

  @ApiProperty({ example: false })
  archived!: boolean;

  @ApiPropertyOptional({ type: CategoryResponseDto, nullable: true })
  category!: CategoryResponseDto | null;

  @ApiProperty({ type: [TagResponseDto] })
  tags!: TagResponseDto[];

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  updatedAt!: Date;
}

export class PaginatedPostsResponseDto {
  @ApiProperty({ type: [PostResponseDto] })
  items!: PostResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination!: PaginationMetaDto;
}
