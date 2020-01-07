import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    const user = await this.authService.register(body)
    const token = await this.authService.createToken(user.id)
    return {
      data: {
        user,
        token,
      },
    }
  }
}
