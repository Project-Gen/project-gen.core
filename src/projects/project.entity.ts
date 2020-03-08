import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Vacantion } from './project-vacantion.entity'

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  userId: number

  @ManyToOne(
    () => User,
    (user) => user.projects
  )
  user: User

  @OneToMany(
    () => Vacantion,
    (vacantion) => vacantion.project
  )
  vacantions: Vacantion[]
}
