import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create({ password, ...data }) {
    const { id } = await this.userRepository.save({
      passwordHash: await this.createPassword(password),
      ...data,
    })
    return this.findOne({ id })
  }

  async findOne(where) {
    return this.userRepository.findOne(where)
  }

  async createPassword(password: string) {
    return bcrypt.hash(password, 10)
  }

  async comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
  }
}
