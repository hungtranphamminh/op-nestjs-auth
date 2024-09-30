import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
  @ApiProperty({ type: String, example: 'john_doe', description: 'The username of the user', required: true })
  username: string;

  @ApiProperty({ type: String, example: 'password', description: 'The password of the user', required: true })
  password: string;
}