import {
 Controller, Post, Body, BadRequestException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

  @Post('register')
  async register(@Body() body) {
    const user = await this.userService.create(body)
    const token = await this.authService.createToken(user.id)
    return {
      data: {
        user,
        token,
      },
    }
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.userService.findOne({ email: body.email })

    if (!user) {
      throw new BadRequestException({ email: 'Email not found' })
    }
    if (!await this.userService.comparePasswords(body.password, user.passwordHash)) {
      throw new BadRequestException({ password: 'Incorrect password' })
    }

    const token = await this.authService.createToken(user.id)
    return {
      data: {
        user,
        token,
      },
    }
  }
}
