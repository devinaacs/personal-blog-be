import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { PaginationMetaDto } from "@/common/dto/pagination-meta.dto";
import { Role } from "@/common/constants/roles";

export class UserResponseDto {
  @ApiProperty({ example: "cm_user_1" })
  id!: string;

  @ApiProperty({ example: "devc@example.com" })
  email!: string;

  @ApiPropertyOptional({ example: "Devc", nullable: true })
  name!: string | null;

  @ApiProperty({ enum: Role, example: Role.USER })
  role!: Role;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  updatedAt!: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  items!: UserResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination!: PaginationMetaDto;
}
