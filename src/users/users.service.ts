import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { Role, User } from './user.entity'
import { CreateUserDto, FindUserDto } from './users.dto'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create({ password, ...data }: CreateUserDto) {
    const { id } = await this.userRepository.save({
      passwordHash: await this.createPassword(password),
      ...data,
    })
    return this.findOne({ id })
  }

  async createUser(data: Omit<CreateUserDto, 'role' | 'id'>) {
    return this.create({ ...data, role: Role.User })
  }

  async createAdmin(data: Omit<CreateUserDto, 'role' | 'id'>) {
    return this.create({ ...data, role: Role.Admin })
  }

  async findOne(where: FindUserDto) {
    return this.userRepository.findOne(where)
  }

  async find() {
    const [raws, count] = await this.userRepository.findAndCount()
    return { raws, count }
  }

  async createPassword(password: string) {
    return bcrypt.hash(password, 10)
  }

  async comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
  }
}
