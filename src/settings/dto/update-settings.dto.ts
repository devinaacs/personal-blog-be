import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: "dev" })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  siteName?: string;

  @ApiPropertyOptional({ example: "developer / writer / overthinker" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  tagline?: string;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsInt()
  @Min(1990)
  @Max(2100)
  establishedYear?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  bio?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  currentlyUsing?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  otherInterests?: string[];

  @ApiPropertyOptional({ example: "hello@mail.dev" })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @ApiPropertyOptional({ example: "https://github.com/username" })
  @IsOptional()
  @IsUrl()
  @MaxLength(300)
  github?: string;

  @ApiPropertyOptional({ example: "https://twitter.com/username" })
  @IsOptional()
  @IsUrl()
  @MaxLength(300)
  twitter?: string;

  @ApiPropertyOptional({ example: "A personal journal about software..." })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  footerBlurb?: string;
}
