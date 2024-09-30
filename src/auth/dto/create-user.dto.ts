import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty(
    {
      type: String,
      example: 'john_doe',
      description: 'The username of the user',
      required: true
    }
  )
  username: string;

  @ApiProperty({ type: String, example: 'john@gmail.com', description: 'The email of the user', required: true })
  email: string;

  @ApiProperty({ type: String, example: 'password', description: 'The password of the user', required: true })
  password: string;

  @ApiProperty({ type: String, example: '', description: 'Refresh token for login', required: false })
  refreshToken: string;
}