import { Role } from '../src/users/user.entity'

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
export const createProjectData = (data, { userId }: { userId: number }) => ({
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
export const createUserData = (data, { role }: { role: Role }) => ({
  ...data,
  role,
})
