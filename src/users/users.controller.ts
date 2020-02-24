import { Controller, Get } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async find() {
    const { count, raws: data } = await this.usersService.find()
    return {
      count,
      data,
    }
  }
}
