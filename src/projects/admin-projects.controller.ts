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
import { ProjectsService } from './projects.service'

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
      data: await this.projectsService.findOne({ id: parseInt(id, 10) }),
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(['admin'])
  /**
   * TODO: @ParseInt(id)
   */
  async deleteById(@Param('id') id: string) {
    const { affected } = await this.projectsService.deleteById(parseInt(id, 10))

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
