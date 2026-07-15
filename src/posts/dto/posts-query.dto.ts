import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { PaginationQueryDto } from "@/common/dto/pagination-query.dto";

export class PostsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: "Filter by category slug" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: "Filter by tag slug" })
  @IsOptional()
  @IsString()
  tag?: string;
}
