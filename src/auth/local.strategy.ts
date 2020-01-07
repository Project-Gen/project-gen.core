import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, BadRequestException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { User } from '../users/user.entity'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email'
    })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({ email })

    if (!user) {
      throw new BadRequestException({ email: 'Email not found' })
    }
    if (!await this.usersService.comparePasswords(password, user.passwordHash)) {
      throw new BadRequestException({ password: 'Incorrect password' })
    }

    return user
  }
}
