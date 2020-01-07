import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(ConfigService) configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    })
  }

  async validate({ id }) {
    const user = await this.usersService.findOne({ id })
    return user
  }
}
