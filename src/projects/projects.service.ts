import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './project.entity'

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) {}

  async create(data) {
    const { id } = await this.projectRepository.save(data)
    return this.findOne({ id })
  }

  async updateById(id: number, data) {
    await this.projectRepository.update({ id }, data)
    return this.findOne({ id })
  }

  async deleteById(id: number) {
    return this.projectRepository.delete({ id })
  }

  async findOne(where) {
    return this.projectRepository.findOne(where, { relations: ['user'] })
  }

  async find(query?) {
    return this.projectRepository.findAndCount(query)
  }
}
