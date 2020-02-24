import { Role } from './user.entity'

export type CreateUserDto = {
  email: string
  password: string
  role: Role
}

export type FindUserDto = {
  id?: number
  email?: string
}
