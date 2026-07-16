import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ClapperResponseDto {
  @ApiProperty({ example: "cmr7z6zoo0004ipb9rth3ia1a" })
  id!: string;

  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  readerId!: string;

  @ApiProperty({ example: 37 })
  count!: number;

  @ApiPropertyOptional({ example: "Mozilla/5.0 ...", nullable: true })
  userAgent!: string | null;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  updatedAt!: Date;
}

export class SharerResponseDto {
  @ApiProperty({ example: "cmr7z6zoo0004ipb9rth3ia1a" })
  id!: string;

  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  readerId!: string;

  @ApiProperty({ example: "twitter" })
  platform!: string;

  @ApiPropertyOptional({ example: "Mozilla/5.0 ...", nullable: true })
  userAgent!: string | null;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  createdAt!: Date;
}

export class EngagementResponseDto {
  @ApiProperty({ example: 340 })
  clapCount!: number;

  @ApiProperty({ example: 8 })
  shareCount!: number;

  @ApiProperty({ type: [ClapperResponseDto] })
  clappers!: ClapperResponseDto[];

  @ApiProperty({ type: [SharerResponseDto] })
  sharers!: SharerResponseDto[];
}
