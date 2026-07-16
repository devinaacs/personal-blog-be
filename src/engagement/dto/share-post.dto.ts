import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsUUID } from "class-validator";

import { SHARE_PLATFORMS, SharePlatform } from "../constants";

export class SharePostDto {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsUUID()
  readerId!: string;

  @ApiProperty({ example: "twitter", enum: SHARE_PLATFORMS })
  @IsIn(SHARE_PLATFORMS)
  platform!: SharePlatform;
}
