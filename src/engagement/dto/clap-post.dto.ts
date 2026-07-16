import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsUUID, Max, Min } from "class-validator";

import { MAX_CLAPS_PER_READER } from "../constants";

export class ClapPostDto {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsUUID()
  readerId!: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: MAX_CLAPS_PER_READER })
  @IsInt()
  @Min(1)
  @Max(MAX_CLAPS_PER_READER)
  increment!: number;
}
