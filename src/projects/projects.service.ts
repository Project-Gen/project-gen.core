import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './project.entity'
import { CreateProjectDto, UpdateProjectDto, FindProjectDto } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) {}

  async create(data: CreateProjectDto) {
    const { id } = await this.projectRepository.save(data)
    return this.findOne({ id })
  }

  async updateById(id: number, data: UpdateProjectDto) {
    await this.projectRepository.update({ id }, data)
    return this.findOne({ id })
  }

  async deleteById(id: number) {
    return this.projectRepository.delete({ id })
  }

  async findOne(where: FindProjectDto) {
    return this.projectRepository.findOne(where, { relations: ['user'] })
  }

  async find(query?) {
    return this.projectRepository.findAndCount(query)
  }
}
