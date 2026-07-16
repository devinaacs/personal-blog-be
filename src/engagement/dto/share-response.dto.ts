import { ApiProperty } from "@nestjs/swagger";

export class ShareResponseDto {
  @ApiProperty({ example: 8 })
  postShareCount!: number;
}
