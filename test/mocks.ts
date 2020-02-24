import { Role } from '../src/users/user.entity'
import { CreateUserDto } from '../src/users/users.dto'
import { CreateProjectDto } from '../src/projects/projects.dto'

/**
 * Add types
 */
export const projectsMocks = [
  {
    title: 'Create caffe',
    description: 'Create caffe',
  },
  {
    title: 'Open gallery',
    description: 'open gallery',
  },
]
export const createProjectData = (data: Omit<CreateProjectDto, 'userId'>, { userId }: Pick<CreateProjectDto, 'userId'>) => ({
  ...data,
  userId,
})

export const authUsersMocks = [
  {
    email: 'admin@email.com',
    password: 'admin',
  },
  {
    email: 'user@email.com',
    password: 'user',
  },
]
export const usersMocks = [
  {
    email: 'john@email.com',
    password: 'john',
  },
  {
    email: 'tim@email.com',
    password: 'tim',
  },
]
export const createUserData = (data: Omit<CreateUserDto, 'role'>, { role }: Pick<CreateUserDto, 'role'>) => ({
  ...data,
  role,
})
