import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from '../auth/role.decorator'
import { RoleGuard } from '../auth/roles.guard'
import { UsersService } from './users.service'

@Controller('/admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  async find() {
    const { count, raws: data } = await this.usersService.find()
    return {
      count,
      data,
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  async create(@Body() body) {
    return {
      data: await this.usersService.create(body),
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  async updateById(@Param('id') id: string, @Body() body) {
    return {
      data: await this.usersService.updateById(parseInt(id, 10), body),
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  async getById(@Param('id') id: string) {
    return {
      data: await this.usersService.findOne({ id: parseInt(id, 10) }),
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  async deleteById(@Param('id') id: string) {
    const { affected } = await this.usersService.deleteById(parseInt(id, 10))

    return {
      data: { affected },
    }
  }
}
