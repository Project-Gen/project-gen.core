import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../users/user.entity'

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
    user => user.projects,
  )
  user: User
}
