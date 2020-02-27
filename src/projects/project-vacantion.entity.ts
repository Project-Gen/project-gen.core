import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from './project.entity'

@Entity()
export class Vacantion {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  projectId: number

  @ManyToOne(
    () => Project,
    project => project.vacantions,
  )
  project: Project
}
