import { Request } from 'express'
import { Controller, Post, Req, Body, UseGuards, Get, HttpCode } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { User } from '../users/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

  @Post('register')
  async register(@Body() body) {
    const user = await this.userService.createAdmin(body)
    const token = await this.authService.createToken(user.id)

    return {
      data: {
        user,
        token,
      },
    }
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  async login(@Req() req: Request) {
    const token = await this.authService.createToken((req.user as User).id)

    return {
      data: {
        user: req.user,
        token,
      },
    }
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  getProfile(@Req() req: Request) {
    return {
      data: req.user,
    }
  }
}
