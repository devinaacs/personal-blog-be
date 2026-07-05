import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SettingsResponseDto {
  @ApiProperty({ example: "singleton" })
  id!: string;

  @ApiProperty({ example: "dev" })
  siteName!: string;

  @ApiProperty({ example: "developer / writer / overthinker" })
  tagline!: string;

  @ApiProperty({ example: 2024 })
  establishedYear!: number;

  @ApiProperty({ type: [String] })
  bio!: string[];

  @ApiProperty({ type: [String] })
  currentlyUsing!: string[];

  @ApiProperty({ type: [String] })
  otherInterests!: string[];

  @ApiProperty({ example: "hello@mail.dev" })
  email!: string;

  @ApiPropertyOptional({
    example: "https://github.com/username",
    nullable: true,
  })
  github!: string | null;

  @ApiPropertyOptional({
    example: "https://www.threads.net/@username",
    nullable: true,
  })
  threads!: string | null;

  @ApiPropertyOptional({
    example: "https://www.linkedin.com/in/username",
    nullable: true,
  })
  linkedin!: string | null;

  @ApiPropertyOptional({
    example: "https://images.unsplash.com/photo-...",
    nullable: true,
  })
  workspaceImageUrl!: string | null;

  @ApiProperty({ example: "A personal journal about software..." })
  footerBlurb!: string;

  @ApiProperty({ example: "2026-01-03T00:00:00.000Z" })
  updatedAt!: Date;
}
