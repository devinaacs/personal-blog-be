import { ApiProperty } from "@nestjs/swagger";

export class ClapResponseDto {
  @ApiProperty({ example: 12 })
  readerClapCount!: number;

  @ApiProperty({ example: 340 })
  postClapCount!: number;
}
