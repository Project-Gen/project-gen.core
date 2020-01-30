import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, BadRequestException } from '@nestjs/common'
import { UsersStorage } from '../users/users.storage'
import { User } from '../users/user.entity'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersStorage) {
    super({
      usernameField: 'email',
    })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({ email })

    if (!user) {
      throw new BadRequestException({ email: 'Email not found' })
    }
    if (!(await this.usersService.comparePasswords(password, user.passwordHash))) {
      throw new BadRequestException({ password: 'Incorrect password' })
    }

    return user
  }
}
