import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminProjectsController } from './admin-projects.controller'
import { ProjectsService } from './projects.service'
import { Project } from './project.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [AdminProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
