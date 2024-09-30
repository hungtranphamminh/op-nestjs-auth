import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-local";
import { jwtConstants } from "src/auth/constants";
import { User } from "src/users/entities/user.entity";
import { UserService } from "src/users/user.service";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.access_secret,
    })

  }

  async validate(payload: any): Promise<User | null> {
    const authUser = await this.usersService.findByUsername(payload.username);
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return authUser;
  }
}