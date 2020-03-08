import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Vacantion } from './project-vacantion.entity'
import { Project } from './project.entity'
import {
  CreateProjectDto,
  FindProjectDto,
  UpdateProjectDto,
  UpdateProjectVacantion,
} from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Vacantion)
    private readonly vacantionRepository: Repository<Vacantion>
  ) {}

  async create({ vacantions, ...data }: CreateProjectDto) {
    const project = await this.projectRepository.save(data)

    if (vacantions) {
      project.vacantions = await this.insertVacantions(vacantions, project)
    }

    const { id } = await this.projectRepository.save(project)

    return this.findOne({ id })
  }

  async updateById(id: number, { vacantions, ...data }: UpdateProjectDto) {
    await this.projectRepository.update({ id }, data)

    const project = await this.findOne({ id })

    if (vacantions) {
      project.vacantions = await this.insertVacantions(vacantions, project)
    }

    await this.projectRepository.save(project)

    return this.findOne({ id })
  }

  async deleteById(id: number) {
    await this.removeVacantions(id)
    return this.projectRepository.delete({ id })
  }

  async findOne(where: FindProjectDto) {
    return this.projectRepository.findOne(where, {
      relations: ['user', 'vacantions'],
    })
  }

  async find(query?) {
    return this.projectRepository.findAndCount({
      where: query,
      relations: ['user', 'vacantions'],
    })
  }

  async insertVacantions(data: UpdateProjectVacantion[], project: Project) {
    const vacantions = await this.vacantionRepository.find({
      projectId: project.id,
    })
    const vacantionIdsForDelete = vacantions
      .filter(
        (existingVacation) =>
          data.findIndex(
            (newVacantion) => existingVacation.id === newVacantion.id
          ) === -1
      )
      .map((vacantion) => vacantion.id)
    if (vacantionIdsForDelete.length) {
      this.vacantionRepository.delete(vacantionIdsForDelete)
    }

    const newVacantions = data
      .filter((vacantion) => !vacantion.id)
      .map((vacantion) =>
        this.vacantionRepository.create({ ...vacantion, project })
      )
    const updatedVacations = data
      .filter((vacantion) => vacantion.id)
      .map((vacantion) =>
        this.vacantionRepository.create({ ...vacantion, project })
      )

    return this.vacantionRepository.save([
      ...newVacantions,
      ...updatedVacations,
    ])
  }

  async removeVacantions(projectId: number) {
    return this.vacantionRepository.delete({ projectId })
  }
}
