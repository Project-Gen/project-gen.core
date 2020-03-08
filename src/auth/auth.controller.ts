import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { User } from '../users/user.entity'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Post('register')
  async register(@Body() body) {
    const user = await this.userService.createUser(body)
    // const user = await this.userService.createAmin(body)
    // INFO: for client admin registration
    // const user = await this.userService.createAdmin(body)
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
