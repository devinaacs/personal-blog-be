import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
  @ApiProperty({ example: "cmr7z6zoo0004ipb9rth3ia1a" })
  id!: string;

  @ApiProperty({ example: "Engineering" })
  name!: string;

  @ApiProperty({ example: "engineering" })
  slug!: string;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  updatedAt!: Date;
}
