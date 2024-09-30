import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  /* Authentication with username & password */
  async signUp(createUserDto: CreateUserDto) {
    //verify if user already exists
    const userExists = await this.usersService.findByUsername(createUserDto.username)

    if (userExists) {
      throw new BadRequestException('Username already taken')
    }

    //hash password
    const hashedPassword = this.hashData(createUserDto.password);

    //create user
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    //generate tokens
    const tokens = await this.getTokens(newUser.id, newUser.username);

    //update user with refresh token
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async signIn(data: AuthDto, isSocialLogin: boolean) {
    const user = await this.usersService.findByUsername(data.username);

    if (!user) {
      throw new BadRequestException('Invalid credentials(username)');
    }

    let passwordMatch: boolean = true
    if (!isSocialLogin) passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials(password)');
    }

    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async refreshAccessToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatch) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /* Authentication with Google oauth 2.0 */
  async validateGoogleUser(googleProfile: any) {
    const user = await this.usersService.findByEmail(googleProfile.email);
    if (user) {
      return user;
    }

    //create new user with random uuid for username and password to avoid duplicate
    const newUser = {
      username: uuidv4(),
      password: uuidv4(),
    }

    const hashedPassword = this.hashData(newUser.password);

    return await this.usersService.create({
      ...newUser,
      password: hashedPassword,
      email: googleProfile.email,
      refreshToken: null,
    });
  }


  //Helper functions
  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('jwt.access_secret'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('jwt.refresh_secret'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private hashData(password: string): string {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
  }
}
