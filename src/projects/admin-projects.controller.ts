import { Controller, Post, Get, Body, Param, UseGuards, Put, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ProjectsService } from './projects.service'
import { RoleGuard } from '../auth/roles.guard'
import { Roles } from '../auth/role.decorator'

@Controller('/admin/projects')
export class AdminProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  /**
   * TODO
   * 1. SaveBodyEntityPipe for omit id for dto
   */
  async create(@Body() body) {
    return {
      data: await this.projectsService.create(body),
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  /**
   * TODO
   * 1. SaveBodyEntityPipe for omit id for dto
   */
  async updateById(@Param('id') id, @Body() body) {
    return {
      data: await this.projectsService.updateById(id, { ...body, id }),
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  /**
   * TODO: @ParseInt(id)
   */
  async findById(@Param('id') id: string) {
    return {
      data: await this.projectsService.findOne({ id }),
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  /**
   * TODO: @ParseInt(id)
   */
  async deleteById(@Param('id') id: string) {
    const { affected } = await this.projectsService.deleteById(Number(id))

    return {
      data: { affected },
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  async findAll() {
    const [data, count] = await this.projectsService.find()
    return {
      data,
      count,
    }
  }
}
