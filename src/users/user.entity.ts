import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Project } from '../projects/project.entity'

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  passwordHash: string

  @Column()
  role: Role

  @OneToMany(
    () => Project,
    project => project.user
  )
  projects: Project[]
}
