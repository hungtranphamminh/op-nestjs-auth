import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /* Authentication with username & password */
  @Post("/sign-up")
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto)
  }

  @Post("/sign-in")
  signIn(@Body() data: AuthDto) {
    return this.authService.signIn(data, false)
  }

  @UseGuards(AccessTokenGuard)
  @Get("/sign-out")
  signOut(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("/refresh")
  refreshAccessToken() {
    return "refresh access token"
  }

  /* Authentication with google oauth 2.0 */
  @Get("/google/login")
  @UseGuards(GoogleAuthGuard)
  async googleAuth() { }

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.signIn(req.user, true);
    res.redirect('http://localhost:3000?access_token=' + tokens.accessToken + '&refresh_token=' + tokens.refreshToken);
  }
}
